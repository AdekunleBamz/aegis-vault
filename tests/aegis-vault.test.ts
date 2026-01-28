import { describe, it, expect, beforeEach } from "vitest";
import { Cl, ClarityType } from "@stacks/transactions";
import { initSimnet } from "@stacks/clarinet-sdk";

// Initialize simnet
const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// Helper to check if result is Ok
function isOk(result: any): boolean {
  return result.type === ClarityType.ResponseOk;
}

// Helper to check if result is Err
function isErr(result: any): boolean {
  return result.type === ClarityType.ResponseErr;
}

// Helper to get Ok value
function getOkValue(result: any): any {
  if (result.type === ClarityType.ResponseOk) {
    return result.value;
  }
  throw new Error("Expected Ok response");
}

// Helper to get Err value
function getErrValue(result: any): any {
  if (result.type === ClarityType.ResponseErr) {
    return result.value;
  }
  throw new Error("Expected Err response");
}

// ============================================
// AEGIS TOKEN TESTS
// ============================================

describe("Aegis Token", () => {
  it("should return correct token metadata", () => {
    const nameResult = simnet.callReadOnlyFn("aegis-token", "get-name", [], deployer);
    expect(isOk(nameResult.result)).toBe(true);
    expect(getOkValue(nameResult.result).data).toBe("Aegis Token");

    const symbolResult = simnet.callReadOnlyFn("aegis-token", "get-symbol", [], deployer);
    expect(isOk(symbolResult.result)).toBe(true);
    expect(getOkValue(symbolResult.result).data).toBe("AGS");

    const decimalsResult = simnet.callReadOnlyFn("aegis-token", "get-decimals", [], deployer);
    expect(isOk(decimalsResult.result)).toBe(true);
    expect(getOkValue(decimalsResult.result).value).toBe(6n);
  });

  it("deployer can add minter", () => {
    const vaultContract = `${deployer}.aegis-vault`;
    
    const block = simnet.callPublicFn("aegis-token", "add-minter", [Cl.principal(vaultContract)], deployer);
    expect(isOk(block.result)).toBe(true);

    const isMinter = simnet.callReadOnlyFn("aegis-token", "is-minter", [Cl.principal(vaultContract)], deployer);
    expect(isMinter.result.type).toBe(ClarityType.BoolTrue);
  });

  it("non-deployer cannot add minter", () => {
    const vaultContract = `${wallet1}.aegis-vault`;
    
    const block = simnet.callPublicFn("aegis-token", "add-minter", [Cl.principal(vaultContract)], wallet1);
    expect(isErr(block.result)).toBe(true);
    expect(getErrValue(block.result).value).toBe(1001n); // ERR-NOT-AUTHORIZED
  });
});

// ============================================
// AEGIS VAULT TESTS
// ============================================

describe("Aegis Vault", () => {
  beforeEach(() => {
    // Setup: Add vault as minter before each test
    const vaultContract = `${deployer}.aegis-vault`;
    simnet.callPublicFn("aegis-token", "add-minter", [Cl.principal(vaultContract)], deployer);
  });

  it("can stake STX with 3-day lock", () => {
    const stakeAmount = 1000000n; // 1 STX
    
    const block = simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(stakeAmount), Cl.uint(3)], wallet1);
    expect(isOk(block.result)).toBe(true);
    
    // Verify stake ID returned
    const stakeId = getOkValue(block.result).value;
    expect(stakeId).toBeGreaterThan(0n);
  });

  it("cannot stake below minimum (0.01 STX)", () => {
    const smallAmount = 5000n; // 0.005 STX (below minimum)
    
    const block = simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(smallAmount), Cl.uint(3)], wallet1);
    expect(isErr(block.result)).toBe(true);
    expect(getErrValue(block.result).value).toBe(3003n); // ERR-INVALID-AMOUNT
  });

  it("cannot stake with invalid lock period", () => {
    const stakeAmount = 1000000n;
    
    const block = simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(stakeAmount), Cl.uint(5)], wallet1); // Invalid: 5 days
    expect(isErr(block.result)).toBe(true);
    expect(getErrValue(block.result).value).toBe(3004n); // ERR-INVALID-LOCK-PERIOD
  });

  it("can stake with all lock periods (3, 7, 30 days)", () => {
    const stakeAmount = 1000000n;
    
    const block1 = simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(stakeAmount), Cl.uint(3)], wallet1);
    expect(isOk(block1.result)).toBe(true);

    const block2 = simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(stakeAmount), Cl.uint(7)], wallet1);
    expect(isOk(block2.result)).toBe(true);

    const block3 = simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(stakeAmount), Cl.uint(30)], wallet1);
    expect(isOk(block3.result)).toBe(true);
  });

  it("cannot withdraw before lock period ends", () => {
    // Stake first
    simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(1000000), Cl.uint(3)], wallet1);

    // Try to withdraw immediately (should fail)
    const block = simnet.callPublicFn("aegis-vault", "withdraw", [Cl.uint(1)], wallet1);
    expect(isErr(block.result)).toBe(true);
    expect(getErrValue(block.result).value).toBe(3006n); // ERR-STAKE-STILL-LOCKED
  });

  it("can emergency withdraw with 2% penalty", () => {
    const stakeAmount = 1000000n; // 1 STX
    
    // Stake first
    simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(stakeAmount), Cl.uint(3)], wallet1);

    // Emergency withdraw
    const block = simnet.callPublicFn("aegis-vault", "emergency-withdraw", [Cl.uint(1)], wallet1);
    expect(isOk(block.result)).toBe(true);
    
    const resultData = getOkValue(block.result).data;
    expect(resultData.returned.value).toBe(980000n);  // 98%
    expect(resultData.penalty.value).toBe(20000n);    // 2%
  });

  it("admin can pause and unpause", () => {
    // Pause
    const pauseBlock = simnet.callPublicFn("aegis-vault", "pause", [], deployer);
    expect(isOk(pauseBlock.result)).toBe(true);

    // Try to stake while paused (should fail)
    const stakeBlock = simnet.callPublicFn("aegis-vault", "stake", [Cl.uint(1000000), Cl.uint(3)], wallet1);
    expect(isErr(stakeBlock.result)).toBe(true);
    expect(getErrValue(stakeBlock.result).value).toBe(3008n); // ERR-CONTRACT-PAUSED

    // Unpause
    const unpauseBlock = simnet.callPublicFn("aegis-vault", "unpause", [], deployer);
    expect(isOk(unpauseBlock.result)).toBe(true);
  });

  it("non-admin cannot pause", () => {
    const block = simnet.callPublicFn("aegis-vault", "pause", [], wallet1);
    expect(isErr(block.result)).toBe(true);
    expect(getErrValue(block.result).value).toBe(3001n); // ERR-NOT-AUTHORIZED
  });
});

// ============================================
// AEGIS TREASURY TESTS
// ============================================

describe("Aegis Treasury", () => {
  it("admin can add vault", () => {
    const vaultContract = `${deployer}.aegis-vault`;
    
    const block = simnet.callPublicFn("aegis-treasury", "add-vault", [Cl.principal(vaultContract)], deployer);
    expect(isOk(block.result)).toBe(true);

    const isVault = simnet.callReadOnlyFn("aegis-treasury", "is-vault-authorized", [Cl.principal(vaultContract)], deployer);
    expect(isVault.result.type).toBe(ClarityType.BoolTrue);
  });

  it("can view treasury stats", () => {
    const stats = simnet.callReadOnlyFn("aegis-treasury", "get-treasury-stats", [], deployer);
    expect(stats.result.type).toBe(ClarityType.Tuple);
  });
});

// ============================================
// STAKING PARAMETERS TEST
// ============================================

describe("Staking Parameters", () => {
  it("should return correct staking parameters", () => {
    const params = simnet.callReadOnlyFn("aegis-vault", "get-staking-params", [], deployer);
    expect(params.result.type).toBe(ClarityType.Tuple);
    
    const paramsData = (params.result as any).data;
    expect(paramsData["min-stake"].value).toBe(10000n); // 0.01 STX
    expect(paramsData["penalty-percent"].value).toBe(2n);
    expect(paramsData["reward-rate-per-day"].value).toBe(5000000n); // 5 tokens
    expect(paramsData["blocks-per-day"].value).toBe(144n);
  });
});

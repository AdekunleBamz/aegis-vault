import { describe, it, expect, beforeEach } from "vitest";
import { ClarityType } from "@stacks/transactions";
import { initSimnet } from "@stacks/clarinet-sdk";
import { Cl } from "../node_modules/@stacks/clarinet-sdk/node_modules/@stacks/transactions/dist/index.js";

// Initialize simnet
const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const DEPLOYER_ADDR = deployer;
const WALLET1_ADDR = wallet1;
const WALLET2_ADDR = wallet2;

// Simnet needs the exact contract identifier
const VAULT_CONTRACT = `${DEPLOYER_ADDR}.aegis-vault-v3`;
const TREASURY_CONTRACT = `${DEPLOYER_ADDR}.aegis-treasury`;
const TOKEN_CONTRACT = `${DEPLOYER_ADDR}.aegis-token-v3`;

// Helper to check ClarityType (handles string or number)
function checkType(val: any, expected: ClarityType): boolean {
  // console.log(`Checking type: ${JSON.stringify(val)} against ${expected}`);
  if (typeof val === 'number') return val === expected;
  if (typeof val === 'string') {
    const typeMap: Record<number, string> = {
      [ClarityType.ResponseOk]: 'ok',
      [ClarityType.ResponseErr]: 'err',
      [ClarityType.BoolTrue]: 'bool',
      [ClarityType.BoolFalse]: 'bool',
      [ClarityType.Tuple]: 'tuple',
      [ClarityType.UInt]: 'uint',
      [ClarityType.Int]: 'int',
    };
    return val === typeMap[expected];
  }
  return false;
}

// Helper to check if result is Ok
function isOk(result: any): boolean {
  return result && (result.type === ClarityType.ResponseOk || checkType(result.type, ClarityType.ResponseOk));
}

// Helper to check if result is Err
function isErr(result: any): boolean {
  return result && (result.type === ClarityType.ResponseErr || checkType(result.type, ClarityType.ResponseErr));
}

// Helper to get Ok value
function getOkValue(result: any): any {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(`Expected Ok response, got ${JSON.stringify(result)}`);
}

// Helper to get Err value
function getErrValue(result: any): any {
  if (isErr(result)) {
    return result.value;
  }
  throw new Error(`Expected Err response, got ${JSON.stringify(result)}`);
}

// ============================================
// AEGIS TOKEN TESTS
// ============================================

describe("Aegis Token", () => {
  it("should return correct token metadata", () => {
    const nameResult = simnet.callReadOnlyFn("aegis-token-v3", "get-name", [], DEPLOYER_ADDR);
    expect(isOk(nameResult.result)).toBe(true);
    expect((getOkValue(nameResult.result) as any).data).toBe("Aegis Token v3");

    const symbolResult = simnet.callReadOnlyFn("aegis-token-v3", "get-symbol", [], DEPLOYER_ADDR);
    expect(isOk(symbolResult.result)).toBe(true);
    expect((getOkValue(symbolResult.result) as any).data).toBe("AGS");

    const decimalsResult = simnet.callReadOnlyFn("aegis-token-v3", "get-decimals", [], DEPLOYER_ADDR);
    expect(isOk(decimalsResult.result)).toBe(true);
    const decimalsValue = getOkValue(decimalsResult.result) as any;
    const parsedDecimals =
      typeof decimalsValue === 'bigint' ? decimalsValue : typeof decimalsValue?.value === 'bigint' ? decimalsValue.value : decimalsValue?.value;
    expect(parsedDecimals).toBe(6n);
  });

  it("deployer can add minter", () => {
    const block = simnet.callPublicFn("aegis-token-v3", "add-minter", [Cl.principal(VAULT_CONTRACT)], DEPLOYER_ADDR);
    expect(isOk(block.result)).toBe(true);
  });

  it("non-deployer cannot add minter", () => {
    const block = simnet.callPublicFn("aegis-token-v3", "add-minter", [Cl.principal(VAULT_CONTRACT)], WALLET1_ADDR);
    expect(isErr(block.result)).toBe(true);
    expect((getErrValue(block.result) as any).value).toBe(7001n);
  });
});

describe("Aegis Vault", () => {
  beforeEach(() => {
    simnet.callPublicFn("aegis-token-v3", "add-minter", [Cl.principal(VAULT_CONTRACT)], DEPLOYER_ADDR);
  });

  it("can stake STX with 3-day lock", () => {
    const stakeAmount = 1000000n;
    const block = simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(stakeAmount), Cl.uint(3)], WALLET1_ADDR);
    expect(isOk(block.result)).toBe(true);
    const stakeId = (getOkValue(block.result) as any).value;
    expect(stakeId).toBeGreaterThan(0n);
  });

  it("cannot stake below minimum (0.01 STX)", () => {
    const smallAmount = 5000n;
    const block = simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(smallAmount), Cl.uint(3)], WALLET1_ADDR);
    expect(isErr(block.result)).toBe(true);
    expect((getErrValue(block.result) as any).value).toBe(1002n);
  });

  it("cannot stake with invalid lock period", () => {
    const block = simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(1000000), Cl.uint(5)], WALLET1_ADDR);
    expect(isErr(block.result)).toBe(true);
    expect((getErrValue(block.result) as any).value).toBe(1003n);
  });

  it("can stake with all lock periods (3, 7, 30 days)", () => {
    const s1 = simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(1000000), Cl.uint(3)], WALLET1_ADDR);
    expect(isOk(s1.result)).toBe(true);
    const s2 = simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(1000000), Cl.uint(7)], WALLET1_ADDR);
    expect(isOk(s2.result)).toBe(true);
    const s3 = simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(1000000), Cl.uint(30)], WALLET1_ADDR);
    expect(isOk(s3.result)).toBe(true);
  });

  it("can request withdrawal but not complete immediately", () => {
    simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(1000000), Cl.uint(3)], WALLET1_ADDR);
    const block = simnet.callPublicFn("aegis-vault-v3", "request-withdrawal", [Cl.uint(1)], WALLET1_ADDR);
    expect(isOk(block.result)).toBe(true);
    const complete = simnet.callPublicFn("aegis-vault-v3", "complete-withdrawal", [], WALLET1_ADDR);
    expect(isErr(complete.result)).toBe(true);
  });

  it("can emergency withdraw", () => {
    simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(1000000), Cl.uint(3)], WALLET1_ADDR);
    const block = simnet.callPublicFn("aegis-vault-v3", "emergency-withdraw", [Cl.uint(1)], WALLET1_ADDR);
    expect(isOk(block.result)).toBe(true);
  });

  it("admin can set paused", () => {
    const p1 = simnet.callPublicFn("aegis-vault-v3", "set-paused", [Cl.bool(true)], DEPLOYER_ADDR);
    expect(isOk(p1.result)).toBe(true);
    const s1 = simnet.callPublicFn("aegis-vault-v3", "stake", [Cl.uint(1000000), Cl.uint(3)], WALLET1_ADDR);
    expect(isErr(s1.result)).toBe(true);
    expect((getErrValue(s1.result) as any).value).toBe(1004n);
    const p2 = simnet.callPublicFn("aegis-vault-v3", "set-paused", [Cl.bool(false)], DEPLOYER_ADDR);
    expect(isOk(p2.result)).toBe(true);
  });

  it("non-admin cannot pause", () => {
    const block = simnet.callPublicFn("aegis-vault-v3", "set-paused", [Cl.bool(true)], WALLET1_ADDR);
    expect(isErr(block.result)).toBe(true);
    expect((getErrValue(block.result) as any).value).toBe(1001n);
  });
});

describe("Aegis Treasury", () => {
  it("admin can add vault", () => {
    const block = simnet.callPublicFn("aegis-treasury", "add-vault", [Cl.principal(VAULT_CONTRACT)], DEPLOYER_ADDR);
    expect(isOk(block.result)).toBe(true);
    const isVault = simnet.callReadOnlyFn("aegis-treasury", "is-vault", [Cl.principal(VAULT_CONTRACT)], DEPLOYER_ADDR);
    expect(isVault.result.type).toBe(ClarityType.BoolTrue);
  });

  it("can view treasury stats", () => {
    const stats = simnet.callReadOnlyFn("aegis-treasury", "get-stats", [], DEPLOYER_ADDR);
    expect(stats.result.type).toBe(ClarityType.Tuple);
  });
});

describe("Staking Parameters", () => {
  it("should return correct staking parameters", () => {
    const stats = simnet.callReadOnlyFn("aegis-vault-v3", "get-vault-stats", [], DEPLOYER_ADDR);
    expect(checkType(stats.result.type, ClarityType.Tuple)).toBe(true);
    const result = stats.result as any;
    const statsData = result.data || result.value;
    expect(statsData["total-staked"].value).toBe(0n);
  });
});

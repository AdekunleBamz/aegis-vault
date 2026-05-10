
/**
 * Validates a deposit amount is at least the minimum (1 STX = 1,000,000 microSTX).
 * @param {*} v - Value to validate
 * @returns {boolean}
 */
export const isValidDepositAmount = (v) => !isNaN(Number(v)) && Number(v) >= 1000000;

/**
 * Validates a lock period is one of the supported day counts.
 * @param {*} v - Value to validate
 * @returns {boolean}
 */
export const isValidLockPeriod = (v) => [7, 30, 90, 180].includes(Number(v));

export const isValidWithdrawalAmount = (v) => !isNaN(Number(v)) && Number(v) > 0;

export const isValidPositionId = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidProposalId = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

/**
 * Validates a vote option is one of the allowed values.
 * @param {*} v - Value to validate
 * @returns {boolean}
 */
export const isValidVoteOption = (v) => ["for","against","abstain"].includes(v);

export const isValidGovernanceAmount = (v) => !isNaN(Number(v)) && Number(v) >= 1;

export const isValidAGSAmount = (v) => !isNaN(Number(v)) && Number(v) >= 0;

export const isValidAddress = (v) => typeof v === "string" && v.startsWith("SP") && v.length >= 30;

export const isValidTxId = (v) => typeof v === "string" && /^0x[0-9a-f]{64}$/.test(v);

export const isValidBlockHeight = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidFeeAmount = (v) => !isNaN(Number(v)) && Number(v) >= 0;

/**
 * Validates an APY in basis points is within the allowed range (0-10000).
 * @param {*} v - Value to validate
 * @returns {boolean}
 */
export const isValidAPYBps = (v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 10000;

export const isValidMaxPositions = (v) => Number.isInteger(Number(v)) && Number(v) >= 1;

export const isValidRewardAmount = (v) => !isNaN(Number(v)) && Number(v) >= 0;

export const isValidSlippage = (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100;

export const isValidMinDeposit = (v) => !isNaN(Number(v)) && Number(v) >= 1000000;

export const isValidMaxDeposit = (v) => !isNaN(Number(v)) && Number(v) <= 1000000000000;

export const isValidLockDays = (v) => [7, 30, 90, 180].includes(Number(v));

export const isValidVaultVersion = (v) => typeof v === "string" && /^\d+\.\d+\.\d+$/.test(v);

export const isValidStakerShare = (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 1;

export const isValidGovernanceQuorum = (v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 10000;

export const isValidCompoundFrequency = (v) => Number.isInteger(Number(v)) && Number(v) >= 1;

export const isValidPositionCount = (v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 5;

export const isValidClaimAmount = (v) => isFinite(Number(v)) && Number(v) >= 0;

export const isValidPauseState = (v) => typeof v === "boolean";

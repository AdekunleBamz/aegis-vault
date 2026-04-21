
export const isValidDepositAmount = (v) => !isNaN(Number(v)) && Number(v) >= 1000000;

export const isValidLockPeriod = (v) => [7, 30, 90, 180].includes(Number(v));

export const isValidWithdrawalAmount = (v) => !isNaN(Number(v)) && Number(v) > 0;

export const isValidPositionId = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidProposalId = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidVoteOption = (v) => ["for","against","abstain"].includes(v);

export const isValidGovernanceAmount = (v) => !isNaN(Number(v)) && Number(v) >= 1;

export const isValidAGSAmount = (v) => !isNaN(Number(v)) && Number(v) >= 0;

export const isValidAddress = (v) => typeof v === "string" && v.startsWith("SP") && v.length >= 30;

export const isValidTxId = (v) => typeof v === "string" && /^0x[0-9a-f]{64}$/.test(v);

export const isValidBlockHeight = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidFeeAmount = (v) => !isNaN(Number(v)) && Number(v) >= 0;

export const isValidAPYBps = (v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 10000;

export const isValidMaxPositions = (v) => Number.isInteger(Number(v)) && Number(v) >= 1;

export const isValidRewardAmount = (v) => !isNaN(Number(v)) && Number(v) >= 0;

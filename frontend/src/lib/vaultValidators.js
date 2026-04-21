
export const isValidDepositAmount = (v) => !isNaN(Number(v)) && Number(v) >= 1000000;

export const isValidLockPeriod = (v) => [7, 30, 90, 180].includes(Number(v));

export const isValidWithdrawalAmount = (v) => !isNaN(Number(v)) && Number(v) > 0;

export const isValidPositionId = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidProposalId = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidVoteOption = (v) => ["for","against","abstain"].includes(v);

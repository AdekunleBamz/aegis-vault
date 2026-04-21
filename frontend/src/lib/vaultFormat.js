
export const formatDepositAmount = (v) => (v / 1e6).toFixed(2) + " STX";

export const formatLockPeriod = (days) => days + " days";

export const formatAPYDisplay = (bps) => (bps / 100).toFixed(2) + "%";

export const formatPositionValue = (v) => (v / 1e6).toFixed(6) + " STX";

export const formatRewardAmount = (v) => (v / 1e6).toFixed(6) + " AGS";

export const formatWithdrawalFee = (bps) => (bps / 100).toFixed(2) + "% fee";

export const formatEarlyExitPenalty = (bps) => (bps / 100).toFixed(2) + "% penalty";

export const formatGovernanceVotes = (n) => n + " votes";

export const formatVaultTVL = (v) => (v / 1e6).toFixed(2) + " STX";

export const formatStakerCount = (n) => n + " stakers";

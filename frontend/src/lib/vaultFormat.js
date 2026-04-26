
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

export const formatBlocksRemaining = (n) => n + " blocks";

export const formatUnlockDate = (ts) => new Date(ts).toLocaleDateString();

export const formatPositionId = (id) => "POS-" + id;

export const formatProposalStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatVoteWeight = (v) => (v / 1e6).toFixed(2) + " AGS";

export const formatTxStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatMicroStx = (v) => (v / 1e6).toFixed(6) + " STX";

export const formatAGSAmount = (v) => (v / 1e6).toFixed(6) + " AGS";

export const formatLockDays = (d) => d + " days locked";

export const formatYieldEarned = (v) => (v / 1e6).toFixed(6) + " AGS earned";

export const formatVaultCapacity = (used, max) => Number(used) + " / " + Number(max);

export const formatApyRange = (minBps, maxBps) => (Number(minBps) / 100).toFixed(2) + "%-" + (Number(maxBps) / 100).toFixed(2) + "%";

export const formatNetAPY = (bps, feeBps) => ((Number(bps) - Number(feeBps)) / 100).toFixed(2) + "% net";

export const formatPositionAge = (blocks) => Math.floor(Number(blocks) / 144) + "d old";

export const formatRewardRate = (bps) => (Number(bps) / 100).toFixed(3) + "% / day";

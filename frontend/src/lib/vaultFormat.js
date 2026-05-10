
/**
 * Formats a microSTX deposit amount as a STX decimal string.
 * @param {number} v - Amount in microSTX
 * @returns {string} e.g. "1.50 STX"
 */
export const formatDepositAmount = (v) => (v / 1e6).toFixed(2) + " STX";

export const formatLockPeriod = (days) => days + " days";

/**
 * Formats an APY in basis points as a percentage string.
 * @param {number} bps - APY in basis points (1 BPS = 0.01%)
 * @returns {string} e.g. "8.00%"
 */
export const formatAPYDisplay = (bps) => (bps / 100).toFixed(2) + "%";

export const formatPositionValue = (v) => (v / 1e6).toFixed(6) + " STX";

/**
 * Formats a reward amount in microAGS as an AGS decimal string.
 * @param {number} v - Amount in micro-AGS
 * @returns {string} e.g. "1.000000 AGS"
 */
export const formatRewardAmount = (v) => (v / 1e6).toFixed(6) + " AGS";

export const formatWithdrawalFee = (bps) => (bps / 100).toFixed(2) + "% fee";

export const formatEarlyExitPenalty = (bps) => (bps / 100).toFixed(2) + "% penalty";

export const formatGovernanceVotes = (n) => n + " votes";

export const formatVaultTVL = (v) => (v / 1e6).toFixed(2) + " STX";

export const formatStakerCount = (n) => n + " stakers";

export const formatBlocksRemaining = (n) => n + " blocks";

/**
 * Formats the unlock date from a Unix timestamp.
 * @param {number|null|undefined} ts - Timestamp in ms
 * @returns {string} Locale date string or empty string
 */
export const formatUnlockDate = (ts) => {
  if (ts == null) return '';
  return new Date(ts).toLocaleDateString();
};

export const formatPositionId = (id) => "POS-" + id;

/**
 * Formats a proposal status for display with title case.
 * @param {string|null|undefined} s - Raw status string
 * @returns {string} Title-cased status
 */
export const formatProposalStatus = (s) => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

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

export const formatVaultStatus = (active) => active ? "Active" : "Closed";

export const formatUnlockCountdown = (blocks) => {
  const days = Math.floor(Number(blocks) / 144);
  const rem = Math.floor((Number(blocks) % 144) * 10 / 144);
  return days + "." + rem + "d remaining";
};

export const formatPenaltyAmount = (v) => (Number(v) / 1e6).toFixed(6) + " STX penalty";

export const formatGovProposalId = (id) => "Proposal #" + Number(id);

export const formatQuorumProgress = (votes, quorum) => {
  const pct = Math.min(100, Math.floor((Number(votes) / Number(quorum)) * 100));
  return pct + "% of quorum";
};

export const formatStakerShare = (userStake, totalStake) => {
  if (Number(totalStake) === 0) return "0.00%";
  return ((Number(userStake) / Number(totalStake)) * 100).toFixed(2) + "%";
};

export const formatClaimableReward = (v) => (Number(v) / 1e6).toFixed(6) + " AGS claimable";

export const formatTotalYield = (v) => (Number(v) / 1e6).toFixed(6) + " AGS total";

export const formatProposalOutcome = (passed) => passed ? "Passed" : "Rejected";

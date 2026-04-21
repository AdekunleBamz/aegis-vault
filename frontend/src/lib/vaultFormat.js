
export const formatDepositAmount = (v) => (v / 1e6).toFixed(2) + " STX";

export const formatLockPeriod = (days) => days + " days";

export const formatAPYDisplay = (bps) => (bps / 100).toFixed(2) + "%";

export const formatPositionValue = (v) => (v / 1e6).toFixed(6) + " STX";

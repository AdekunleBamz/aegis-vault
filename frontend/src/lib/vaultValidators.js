
export const isValidDepositAmount = (v) => !isNaN(Number(v)) && Number(v) >= 1000000;

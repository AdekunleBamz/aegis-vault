import { MIN_STAKE_STX } from './constants';

/**
 * Validates a staking amount against user balance and protocol rules.
 * 
 * @param amount - The raw string amount from input
 * @param numAmount - The parsed numeric amount
 * @param balanceSTX - The user's available STX balance
 * @returns string | null - Error message if invalid, otherwise null
 */
export function validateStakeAmount(
  amount: string,
  numAmount: number,
  balanceSTX: number
): string | null {
  if (!amount) return null;
  if (numAmount <= 0) return 'Amount must be greater than 0';
  if (numAmount > balanceSTX) return 'Insufficient STX balance';
  if (numAmount < MIN_STAKE_STX) return `Minimum stake is ${MIN_STAKE_STX} STX`;
  return null;
}

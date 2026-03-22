/**
 * Validation Helpers for Aegis Vault
 * 
 * Provides specialized validation logic for domain-specific inputs like
 * staking amounts, ensuring they meet protocol and balance requirements.
 */

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
  return null;
}

const validationHelpers = {
  validateStakeAmount,
};

export default validationHelpers;

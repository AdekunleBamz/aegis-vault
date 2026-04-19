/**
 * @file API utilities for Aegis Vault
 *
 * Provides functions for interacting with the Stacks blockchain API,
 * including account balances, transactions, and contract reads.
 *
 * @author Aegis Vault Team
 */

import { API } from './constants';

/**
 * Account balance data returned by the Stacks API.
 */
export interface AccountBalance {
  stx: {
    balance: string;
    locked: string;
  };
  fungible_tokens: Record<string, { balance: string }>;
}

/**
 * Transaction data from the Stacks blockchain.
 */
export interface Transaction {
  tx_id: string;
  tx_type: string;
  tx_status: string;
  block_height: number;
  burn_block_time: number;
  sender_address: string;
  fee_rate: string;
  contract_call?: {
    contract_id: string;
    function_name: string;
    function_args: Array<{
      name: string;
      type: string;
      repr: string;
    }>;
  };
}

/**
 * Result from a read-only contract function call.
 */
export interface ContractReadResult {
  okay: boolean;
  result?: string;
}

/**
 * Fetches the current balance for a Stacks account.
 *
 * @param address - The Stacks address to query.
 * @returns Promise containing STX and fungible token balances.
 */

export async function getAccountBalance(address: string): Promise<AccountBalance> {
  const response = await fetch(`${API.STACKS_API}/v2/accounts/${address}`, {
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch account balance');
  }

  return response.json();
}

/**
 * Fetches transaction history for a Stacks address.
 *
 * @param address - The Stacks address to query.
 * @param limit - Maximum number of transactions to return (default: 20).
 * @returns Array of transaction records.
 */
export async function getAccountTransactions(
  address: string,
  limit = 20
): Promise<Transaction[]> {
  const response = await fetch(
    `${API.STACKS_API}/extended/v1/address/${address}/transactions?limit=${limit}`,
    { next: { revalidate: 30 } }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const data = await response.json();
  return data.results;
}

/**
 * Calls a read-only function on a Clarity smart contract.
 *
 * @param contractAddress - The contract's Stacks address.
 * @param contractName - The contract name.
 * @param functionName - The function to call.
 * @param args - Function arguments as hex-encoded strings.
 * @returns The contract call result.
 */
export async function callReadOnlyFunction(
  contractAddress: string,
  contractName: string,
  functionName: string,
  args: string[] = []
): Promise<ContractReadResult> {
  const response = await fetch(
    `${API.STACKS_API}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: contractAddress,
        arguments: args,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to call contract function');
  }

  return response.json();
}

/**
 * Fetches the current Stacks blockchain tip height.
 *
 * @returns The current block height.
 */
export async function getCurrentBlockHeight(): Promise<number> {
  const response = await fetch(`${API.STACKS_API}/v2/info`, {
    next: { revalidate: 10 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch block height');
  }

  const data = await response.json();
  return data.stacks_tip_height;
}

import { API } from './constants';

export interface AccountBalance {
  stx: {
    balance: string;
    locked: string;
  };
  fungible_tokens: Record<string, { balance: string }>;
}

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

export interface ContractReadResult {
  okay: boolean;
  result?: string;
}

/**
 * Fetches the STX and fungible token balances for a given Stacks address.
 * Queries the Stacks Blockchain API v2 accounts endpoint with a 30s revalidation.
 * 
 * @param address - The Stacks address whose balance to retrieve
 * @returns A promise that resolves to an AccountBalance object containing STX and FT balances
 * @throws {Error} If the network request fails or returns a non-200 status
 */
export async function getAccountBalance(address: string): Promise<AccountBalance> {
  const response = await fetch(`${API.STACKS_API}/v2/accounts/${address}`, {
    next: { revalidate: 30 },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch account balance for ${address}`);
  }
  
  return response.json();
}

/**
 * Retrieves the transaction history for a given Stacks address.
 * Returns a list of decoded transaction objects.
 * 
 * @param address - The Stacks address to fetch transactions for
 * @param limit - Optional maximum number of transactions to return (default: 20)
 * @returns A promise that resolves to an array of Transaction objects
 * @throws {Error} If the network request fails
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
    throw new Error(`Failed to fetch transactions for ${address}`);
  }
  
  const data = await response.json();
  return data.results;
}

/**
 * Calls a read-only function on a Stacks smart contract.
 * Used for querying contract state without broadcasting a transaction.
 * 
 * @param contractAddress - The address of the contract owner
 * @param contractName - The name of the contract (e.g., 'staking-v1')
 * @param functionName - The specific read-only function to invoke
 * @param args - Array of Clarity values as hex strings
 * @returns A promise that resolves to a ContractReadResult
 * @throws {Error} If the contract call request fails
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
    throw new Error(`Contract call failed: ${functionName}`);
  }
  
  return response.json();
}

/**
 * Fetches the current stacks-tip-height (burn block height) from the Stacks node.
 * Used for calculating reward maturities and timing sequences.
 * 
 * @returns A promise that resolves to the current block height as a number
 * @throws {Error} If the node information cannot be retrieved
 */
export async function getCurrentBlockHeight(): Promise<number> {
  const response = await fetch(`${API.STACKS_API}/v2/info`, {
    next: { revalidate: 10 },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch blockchain info');
  }
  
  const data = await response.json();
  return data.stacks_tip_height;
}

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

export async function getAccountBalance(address: string): Promise<AccountBalance> {
  const response = await fetch(`${API.STACKS_API}/v2/accounts/${address}`, {
    next: { revalidate: 30 },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch account balance');
  }
  
  return response.json();
}

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

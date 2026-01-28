import { API_BASE_URL } from './constants';

export interface ContractInfo {
  tx_id: string;
  canonical: boolean;
  contract_id: string;
  block_height: number;
  source_code: string;
  abi: string;
}

export interface BalancesResponse {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
    lock_height: number;
    lock_tx_id: string;
    locked: string;
  };
  fungible_tokens: Record<string, { balance: string; total_sent: string; total_received: string }>;
  non_fungible_tokens: Record<string, { count: string; total_sent: string; total_received: string }>;
}

export interface TransactionResponse {
  tx_id: string;
  nonce: number;
  fee_rate: string;
  sender_address: string;
  sponsored: boolean;
  post_condition_mode: string;
  tx_type: string;
  tx_status: string;
  block_height: number;
  block_hash: string;
  burn_block_time: number;
  canonical: boolean;
}

// Fetch contract info
export async function getContractInfo(contractId: string): Promise<ContractInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/extended/v1/contract/${contractId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Fetch account balances
export async function getBalances(address: string): Promise<BalancesResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/extended/v1/address/${address}/balances`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Fetch transaction details
export async function getTransaction(txId: string): Promise<TransactionResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/extended/v1/tx/${txId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Fetch transactions for an address
export async function getTransactions(
  address: string,
  limit = 20,
  offset = 0
): Promise<{ results: TransactionResponse[]; total: number } | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/extended/v1/address/${address}/transactions?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Watch for transaction confirmation
export async function waitForTransaction(
  txId: string,
  maxAttempts = 30,
  interval = 10000
): Promise<TransactionResponse | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const tx = await getTransaction(txId);
    if (tx && tx.tx_status !== 'pending') {
      return tx;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return null;
}

// Get current block height
export async function getCurrentBlock(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/extended/v1/block?limit=1`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.results?.[0]?.height || 0;
  } catch {
    return 0;
  }
}

// Check if a transaction is confirmed
export async function isTransactionConfirmed(txId: string): Promise<boolean> {
  const tx = await getTransaction(txId);
  return tx?.tx_status === 'success';
}

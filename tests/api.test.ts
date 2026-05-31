import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAccountBalance } from '../frontend/src/lib/api';

describe('api utilities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches account balances from the indexed balances endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        stx: { balance: '123000000', locked: '0' },
        fungible_tokens: {},
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const balance = await getAccountBalance(' SP123 ');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.mainnet.hiro.so/extended/v1/address/SP123/balances',
      { cache: 'no-store' }
    );
    expect(balance.stx.balance).toBe('123000000');
  });
});

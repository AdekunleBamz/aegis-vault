
export const VAULT_CONTRACT_ADDRESS = "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9"

export const VAULT_CONTRACT_NAME = "aegis-vault-v1"

export const AGS_TOKEN_ADDRESS = "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9"

export const MIN_DEPOSIT_USTX = 1000000

export const MAX_DEPOSIT_USTX = 100000000000

export const BASE_APY_BPS = 800

export const LOCK_PERIOD_7D = 7 * 144

export const LOCK_PERIOD_30D = 30 * 144

export const LOCK_PERIOD_90D = 90 * 144

export const LOCK_PERIOD_180D = 180 * 144

export const WITHDRAWAL_FEE_BPS = 50

export const EARLY_EXIT_PENALTY_BPS = 300

export const GOVERNANCE_QUORUM_BPS = 1000

export const GOVERNANCE_VOTE_DELAY = 144

export const GOVERNANCE_VOTE_DURATION = 1440

export const STACKS_BLOCKS_PER_DAY = 144

export const VAULT_VERSION = "1.0.0"

export const SUPPORTED_LOCK_PERIODS = [7, 30, 90, 180]

export const REWARD_DISTRIBUTION_FREQUENCY = 144

export const MAX_POSITIONS_PER_WALLET = 5

export const GOVERNANCE_EXECUTION_DELAY = 144

export const SLIPPAGE_TOLERANCE_BPS = 50

export const MAX_GOVERNANCE_PROPOSALS = 20

export const VAULT_PAUSE_COOLDOWN_BLOCKS = 144

export const REWARD_CLAIM_DELAY_BLOCKS = 10

export const MAX_EARLY_EXIT_PENALTY_BPS = 500

/** Maximum allowed staking APY in basis points for display validation */
export const MAX_APY_BPS = 5000

/** Minimum AGS token balance required to submit a governance proposal */
export const MIN_GOVERNANCE_PROPOSAL_BALANCE = 1_000_000

/** Default UI refresh interval for vault position data (ms) */
export const VAULT_UI_REFRESH_MS = 30_000

/** Maximum character length for a vault position label */
export const VAULT_POSITION_LABEL_MAX_LENGTH = 48

/** Minimum reward amount in microSTX before claim is allowed */
export const MIN_CLAIMABLE_REWARD_USTX = 100_000

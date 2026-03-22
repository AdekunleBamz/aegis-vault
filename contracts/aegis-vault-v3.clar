;; Aegis Vault v3 - Consolidated Staking, Rewards, and Treasury
;; Fixed fees set to 0.01 STX (10,000 microSTX)

(use-trait ft-trait .sip-010-trait.sip-010-trait)

;; ============================================
;; CONSTANTS
;; ============================================

(define-constant CONTRACT-OWNER tx-sender)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u1001))
(define-constant ERR-INVALID-AMOUNT (err u1002))
(define-constant ERR-INVALID-LOCK-PERIOD (err u1003))
(define-constant ERR-CONTRACT-PAUSED (err u1004))
(define-constant ERR-MAX-STAKES-REACHED (err u1005))
(define-constant ERR-NOT-UNLOCKED (err u1006))
(define-constant ERR-NO-STAKE-FOUND (err u1007))
(define-constant ERR-INTERNAL-STATE (err u1008))

;; Staking parameters
(define-constant MIN-STAKE u10000)           ;; 0.01 STX
(define-constant FEE-AMOUNT u10000)          ;; 0.01 STX fixed fee for specific actions
(define-constant MAX-STAKES-PER-USER u20)
(define-constant BLOCKS-PER-DAY u144)

;; Reward rate (based on v2-15)
(define-constant BASE-REWARD-PER-DAY u5000000)  ;; 5 AGS tokens

;; Lock periods (in days)
(define-constant LOCK-3-DAYS u3)
(define-constant LOCK-7-DAYS u7)
(define-constant LOCK-30-DAYS u30)

;; Bonus multipliers (basis points)
(define-constant BONUS-3-DAYS u10000)        ;; 1.0x
(define-constant BONUS-7-DAYS u12000)        ;; 1.2x  
(define-constant BONUS-30-DAYS u15000)       ;; 1.5x

;; ============================================
;; DATA VARIABLES
;; ============================================

(define-data-var contract-paused bool false)
(define-data-var total-staked uint u0)
(define-data-var total-stakers uint u0)
(define-data-var stake-counter uint u0)
(define-data-var token-contract principal .aegis-token-v3)

;; ============================================
;; DATA MAPS
;; ============================================

(define-map stakes 
  { staker: principal, stake-id: uint }
  {
    amount: uint,
    start-block: uint,
    lock-period-type: uint,
    bonus-multiplier: uint,
    is-active: bool,
    total-claimed: uint
  }
)

(define-map user-stake-ids principal (list 20 uint))
(define-map user-total-staked principal uint)

;; Withdrawal cooldown
(define-map withdrawal-requests
  principal
  { amount: uint, unlock-block: uint, stake-id: uint }
)

;; ============================================
;; PRIVATE HELPERS
;; ============================================

(define-private (get-lock-blocks (lock-period uint))
  (* lock-period BLOCKS-PER-DAY)
)

(define-private (get-bonus-multiplier (lock-period uint))
  (if (is-eq lock-period LOCK-30-DAYS)
    BONUS-30-DAYS
    (if (is-eq lock-period LOCK-7-DAYS)
      BONUS-7-DAYS
      BONUS-3-DAYS
    )
  )
)

(define-private (calculate-pending-rewards (stake-data {
  amount: uint,
  start-block: uint,
  lock-period-type: uint,
  bonus-multiplier: uint,
  is-active: bool,
  total-claimed: uint
}))
  (let
    (
      (blocks-staked (- block-height (get start-block stake-data)))
      (days-staked (/ blocks-staked BLOCKS-PER-DAY))
      (base-rewards (* (/ (* days-staked BASE-REWARD-PER-DAY) u1000000) (get amount stake-data)))
      (with-bonus (/ (* base-rewards (get bonus-multiplier stake-data)) u10000))
    )
    (if (> with-bonus (get total-claimed stake-data))
      (- with-bonus (get total-claimed stake-data))
      u0
    )
  )
)

;; ============================================
;; PUBLIC FUNCTIONS
;; ============================================

;; @desc Allows a user to stake STX for a chosen lock period.
;; @param amount - The quantity of microSTX to stake (must be >= MIN-STAKE).
;; @param lock-period - The duration in days (3, 7, or 30).
;; @returns (ok uint) - The unique stake-id generated for this position.
(define-public (stake (amount uint) (lock-period uint))
  (let
    (
      (staker tx-sender)
      (current-ids (default-to (list) (map-get? user-stake-ids staker)))
      (new-id (+ (var-get stake-counter) u1))
    )
    ;; Ensure contract is not paused
    (asserts! (not (var-get contract-paused)) ERR-CONTRACT-PAUSED)
    ;; Validate stake amount meets minimum requirement
    (asserts! (>= amount MIN-STAKE) ERR-INVALID-AMOUNT)
    ;; Validate chosen lock period is one of the supported tiers
    (asserts! (or (is-eq lock-period u3) (or (is-eq lock-period u7) (is-eq lock-period u30))) ERR-INVALID-LOCK-PERIOD)
    ;; Limit number of active stakes per user to prevent OOG issues
    (asserts! (< (len current-ids) MAX-STAKES-PER-USER) ERR-MAX-STAKES-REACHED)

    ;; Transfer STX from user to the contract
    (try! (stx-transfer? amount staker (as-contract tx-sender)))

    ;; Initialize and store stake metadata
    (map-set stakes { staker: staker, stake-id: new-id }
      {
        amount: amount,
        start-block: block-height,
        lock-period-type: lock-period,
        bonus-multiplier: (get-bonus-multiplier lock-period),
        is-active: true,
        total-claimed: u0
      }
    )
    ;; Update user and global tracking state
    (map-set user-stake-ids staker (unwrap! (as-max-len? (append current-ids new-id) u20) ERR-MAX-STAKES-REACHED))
    (map-set user-total-staked staker (+ (default-to u0 (map-get? user-total-staked staker)) amount))
    (var-set total-staked (+ (var-get total-staked) amount))
    (var-set stake-counter new-id)
    ;; Increment total stakers count if this is the user's first stake
    (if (is-eq (len current-ids) u0) (var-set total-stakers (+ (var-get total-stakers) u1)) true)
    (ok new-id)
  )
)

;; @desc Initiates the two-step withdrawal process by creating a request.
;; @desc A 24-hour cooling period (BLOCKS-PER-DAY) must pass before completion.
;; @param stake-id - The ID of the active stake to withdraw.
;; @returns (ok bool) - True if the request is successfully registered.
(define-public (request-withdrawal (stake-id uint))
  (let
    (
      (staker tx-sender)
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
    )
    ;; Verify the stake belongs to the sender and is still active
    (asserts! (get is-active stake-data) ERR-NO-STAKE-FOUND)
    ;; Prevent multiple concurrent withdrawal requests for the same user
    (asserts! (is-eq (map-get? withdrawal-requests staker) none) ERR-INTERNAL-STATE)

    ;; Store request with the unlock block height (current + 1 day)
    (map-set withdrawal-requests staker { 
      amount: (get amount stake-data), 
      unlock-block: (+ block-height BLOCKS-PER-DAY),
      stake-id: stake-id
    })
    (ok true)
  )
)

;; @desc Finalizes a pending withdrawal after the cooling period.
;; @desc Automatically claims any pending rewards before transferring the principal.
;; @returns (ok bool) - True if the withdrawal is successfully finalized.
(define-public (complete-withdrawal)
  (let
    (
      (staker tx-sender)
      (request (unwrap! (map-get? withdrawal-requests staker) ERR-NO-STAKE-FOUND))
      (stake-id (get stake-id request))
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
    )
    ;; Ensure the cooling period has elapsed (1 day / 144 blocks)
    (asserts! (>= block-height (get unlock-block request)) ERR-NOT-UNLOCKED)
    
    ;; Calculate and mint any remaining yield before closing the position
    (let ((pending (calculate-pending-rewards stake-data)))
      (if (> pending u0)
        (try! (as-contract (contract-call? .aegis-token-v3 mint staker pending)))
        true
      )
    )

    ;; Execute STX transfer from contract back to user
    ;; A fixed fee (FEE-AMOUNT) is deducted for protocol maintenance
    (try! (as-contract (stx-transfer? (- (get amount request) FEE-AMOUNT) tx-sender staker)))
    (try! (as-contract (stx-transfer? FEE-AMOUNT tx-sender CONTRACT-OWNER)))

    ;; Permanent storage cleanup and state updates
    (map-set stakes { staker: staker, stake-id: stake-id } (merge stake-data { is-active: false }))
    (map-delete withdrawal-requests staker)
    (map-set user-total-staked staker (- (default-to u0 (map-get? user-total-staked staker)) (get amount request)))
    (var-set total-staked (- (var-get total-staked) (get amount request)))
    (ok true)
  )
)

;; @desc Provides instant liquidity by bypassing the normal withdrawal cooldown.
;; @desc Users receive their principal immediately minus a fixed protocol fee.
;; @param stake-id - The ID of the active stake to emergency withdraw.
;; @returns (ok bool) - True if the emergency withdrawal is successful.
(define-public (emergency-withdraw (stake-id uint))
  (let
    (
      (staker tx-sender)
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
      (amount (get amount stake-data))
    )
    ;; Ensure the stake is active and belongs to the caller
    (asserts! (get is-active stake-data) ERR-NO-STAKE-FOUND)
    
    ;; Immediate transfer of principal minus fixed protocol fee
    (try! (as-contract (stx-transfer? (- amount FEE-AMOUNT) tx-sender staker)))
    (try! (as-contract (stx-transfer? FEE-AMOUNT tx-sender CONTRACT-OWNER)))

    ;; State cleanup: mark stake as inactive and update global totals
    (map-set stakes { staker: staker, stake-id: stake-id } (merge stake-data { is-active: false }))
    (map-set user-total-staked staker (- (default-to u0 (map-get? user-total-staked staker)) amount))
    (var-set total-staked (- (var-get total-staked) amount))
    (ok true)
  )
)

;; @desc Allows a staker to claim their accrued AGS rewards for a specific stake.
;; @desc Rewards are minted directly from the linked aegis-token-v3 contract.
;; @param stake-id - The ID of the stake to claim rewards for.
;; @returns (ok uint) - The amount of rewards successfully claimed.
(define-public (claim-rewards (stake-id uint))
  (let
    (
      (staker tx-sender)
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
      (pending (calculate-pending-rewards stake-data))
    )
    ;; Ensure the position is active and has rewards available to claim
    (asserts! (get is-active stake-data) ERR-NO-STAKE-FOUND)
    (asserts! (> pending u0) ERR-INVALID-AMOUNT)

    ;; Mint the reward tokens to the staker
    (try! (as-contract (contract-call? .aegis-token-v3 mint staker pending)))
    
    ;; Update the stake's cumulative claimed rewards count
    (map-set stakes { staker: staker, stake-id: stake-id } 
      (merge stake-data { total-claimed: (+ (get total-claimed stake-data) pending) })
    )
    (ok pending)
  )
)

;; ============================================
;; ADMIN FUNCTIONS
;; ============================================

(define-public (set-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set contract-paused paused)
    (ok true)
  )
)

(define-public (withdraw-treasury (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (ok true)
  )
)

;; ============================================
;; READ-ONLY
;; ============================================

;; @desc Calculates the currently accruable rewards for a specific stake.
;; @param staker - The address of the position owner.
;; @param stake-id - The ID of the stake to query.
;; @returns (ok uint) - The amount of AGS rewards (micro-units) pending.
(define-read-only (get-pending-rewards (staker principal) (stake-id uint))
  (match (map-get? stakes { staker: staker, stake-id: stake-id })
    stake-data (ok (calculate-pending-rewards stake-data))
    (ok u0)
  )
)

;; @desc Returns a summary of the protocol's current state and liquidity.
;; @returns (tuple) - Includes total-staked, total-stakers, stake-counter, pause status, and contract balance.
(define-read-only (get-vault-stats)
  {
    total-staked: (var-get total-staked),
    total-stakers: (var-get total-stakers),
    stake-counter: (var-get stake-counter),
    is-paused: (var-get contract-paused),
    balance: (stx-get-balance (as-contract tx-sender))
  }
)

;; SPDX-License-Identifier: MIT
;; @title Aegis Vault v3
;; @notice Consolidated Staking, Rewards, and Treasury contract for the Aegis Protocol.
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

;; Stake STX
(define-public (stake (amount uint) (lock-period uint))
  (let
    (
      (staker tx-sender)
      (current-ids (default-to (list) (map-get? user-stake-ids staker)))
      (new-id (+ (var-get stake-counter) u1))
    )
    (asserts! (not (var-get contract-paused)) ERR-CONTRACT-PAUSED)
    (asserts! (>= amount MIN-STAKE) ERR-INVALID-AMOUNT)
    (asserts! (or (is-eq lock-period u3) (or (is-eq lock-period u7) (is-eq lock-period u30))) ERR-INVALID-LOCK-PERIOD)
    (asserts! (< (len current-ids) MAX-STAKES-PER-USER) ERR-MAX-STAKES-REACHED)

    (try! (stx-transfer? amount staker (as-contract tx-sender)))

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
    (map-set user-stake-ids staker (unwrap! (as-max-len? (append current-ids new-id) u20) ERR-MAX-STAKES-REACHED))
    (map-set user-total-staked staker (+ (default-to u0 (map-get? user-total-staked staker)) amount))
    (var-set total-staked (+ (var-get total-staked) amount))
    (var-set stake-counter new-id)
    (if (is-eq (len current-ids) u0) (var-set total-stakers (+ (var-get total-stakers) u1)) true)
    (ok new-id)
  )
)

;; Two-step Withdrawal
(define-public (request-withdrawal (stake-id uint))
  (let
    (
      (staker tx-sender)
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
    )
    (asserts! (get is-active stake-data) ERR-NO-STAKE-FOUND)
    (asserts! (is-eq (map-get? withdrawal-requests staker) none) ERR-INTERNAL-STATE)

    (map-set withdrawal-requests staker {
      amount: (get amount stake-data),
      unlock-block: (+ block-height BLOCKS-PER-DAY),
      stake-id: stake-id
    })
    (ok true)
  )
)

(define-public (complete-withdrawal)
  (let
    (
      (staker tx-sender)
      (request (unwrap! (map-get? withdrawal-requests staker) ERR-NO-STAKE-FOUND))
      (stake-id (get stake-id request))
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
    )
    (asserts! (>= block-height (get unlock-block request)) ERR-NOT-UNLOCKED)

    ;; Claim remaining rewards
    (let ((pending (calculate-pending-rewards stake-data)))
      (if (> pending u0)
        (try! (as-contract (contract-call? .aegis-token-v3 mint staker pending)))
        true
      )
    )

    ;; Transfer STX - Fee of 0.01 STX deducted for protocol
    (try! (as-contract (stx-transfer? (- (get amount request) FEE-AMOUNT) tx-sender staker)))
    (try! (as-contract (stx-transfer? FEE-AMOUNT tx-sender CONTRACT-OWNER)))

    ;; Cleanup
    (map-set stakes { staker: staker, stake-id: stake-id } (merge stake-data { is-active: false }))
    (map-delete withdrawal-requests staker)
    (map-set user-total-staked staker (- (default-to u0 (map-get? user-total-staked staker)) (get amount request)))
    (var-set total-staked (- (var-get total-staked) (get amount request)))
    (ok true)
  )
)

;; Emergency Withdrawal - Instant but with 0.01 STX fee
(define-public (emergency-withdraw (stake-id uint))
  (let
    (
      (staker tx-sender)
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
      (amount (get amount stake-data))
    )
    (asserts! (get is-active stake-data) ERR-NO-STAKE-FOUND)

    (try! (as-contract (stx-transfer? (- amount FEE-AMOUNT) tx-sender staker)))
    (try! (as-contract (stx-transfer? FEE-AMOUNT tx-sender CONTRACT-OWNER)))

    (map-set stakes { staker: staker, stake-id: stake-id } (merge stake-data { is-active: false }))
    (map-set user-total-staked staker (- (default-to u0 (map-get? user-total-staked staker)) amount))
    (var-set total-staked (- (var-get total-staked) amount))
    (ok true)
  )
)

;; Claim Rewards
(define-public (claim-rewards (stake-id uint))
  (let
    (
      (staker tx-sender)
      (stake-data (unwrap! (map-get? stakes { staker: staker, stake-id: stake-id }) ERR-NO-STAKE-FOUND))
      (pending (calculate-pending-rewards stake-data))
    )
    (asserts! (get is-active stake-data) ERR-NO-STAKE-FOUND)
    (asserts! (> pending u0) ERR-INVALID-AMOUNT)

    (try! (as-contract (contract-call? .aegis-token-v3 mint staker pending)))
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

(define-read-only (get-pending-rewards (staker principal) (stake-id uint))
  (match (map-get? stakes { staker: staker, stake-id: stake-id })
    stake-data (ok (calculate-pending-rewards stake-data))
    (ok u0)
  )
)

(define-read-only (get-vault-stats)
  {
    total-staked: (var-get total-staked),
    total-stakers: (var-get total-stakers),
    stake-counter: (var-get stake-counter),
    is-paused: (var-get contract-paused),
    balance: (stx-get-balance (as-contract tx-sender))
  }
)

export type StakePosition = {
  id: number
  amount: number
  lockDays: number
  startHeight: number
  multiplier: number
  status: 'active' | 'unlocking' | 'withdrawn'
}

export type RewardSnapshot = {
  claimable: number
  totalEarned: number
  nextPayoutInHours: number
}

# Stake card skeleton state

Stake cards should use skeleton loading only while reads are active, then switch
to empty or error states.

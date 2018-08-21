# Avoiding common attacks


## Known attacks and measures I took to protect from them

### Race Conditions7
 - Not affected by this as the only eth transfer is sent when withdrawing balance from store

### Transaction-Ordering Dependence (TOD) / Front Running
 - Whilst there may be occasions where two conflicting tx (one relies on state modified by the other) are included in a single block, the code is not exposed to maliciousness. If an 'attacker' wishes to observe the blocks and purchase a product in front of a pending tx he is welcome to, this will not negatively affect the app

### Timestamp Dependence
 - No contract functions depend on timestamp as it can be manipulated by miner

### Integer Overflow and Underflow
 - Used suitably sized `uint`'s throughout to provide reasonable protection from integer overflow
 - Only decrement an integer in one position -> `PurchaseProduct` in `DMartStore`, which can only be accessed if the product `hasStock` (> 0), therefore the stock cannot underflow 

### DoS with (Unexpected) revert
 - Not affected, only Store owner can withdraw funds

### DoS with Block Gas Limit
 - Instead of being forced to loop over dynamic arrays, I have used multiple methods to assist my data structures:
     - `DMartAdmin.sol` -> Used a mapping to maintain the index of a Store Owner in our array `mapping(address => uint)` to avoid having to cycle through array
     - `DMartStore.sol` maintains array length as a `uint` in order to track and provide visibility on storage

### Forcibly Sending Ether to a Contract
 - Have not put any logic in a fallback function
 - Have not used `this.balance` to modify functionality
# Design pattern decisions

## Circuit breaker / Emergency Stop
 - Used `Pausable` interface provided by zeppelin via EthPM to emergency stop important contracts
 - This means that the power returns back to the owner in the event that our code is 
 deemed susceptible to an attack

#### Where did I implement this?
 - `DMartAdmin`
 - `DMartStoreManagement`
 - `DMartStore` has its own type, in which the Owner can mark the store as 'Closed for business', 
 stopping new orders - this is a bit more of a soft pause



## What other design patterns did I use?
 - __Separation of concerns__ by splitting Admin/Management/Store
    - This is a classic development pattern, beneficial for numerous reasons:
        - Allows us to track down and deal with bugs easier
        - Provides a logical flow when working and interacting with the application
        - Makes deployment easier and costs less gas
        - Prepares for future upgrades and allows room for development
 - __Store Proxy Factory__
    - Instead of deploying full copies of `DMartStore` when creating new stores, we just deploy a proxy pointing
    to the store instance
    - __Contract deployment costs for creating new store instance went from ~2000000 gas to ~200000.. 90% saving!__
    - This design allows for upgradability in the future, should we wish to create Stores using a different master
    copy that contains additional or upgraded functionality




## Utilisation of libraries/EthPM
 - `Pausable` from Zeppelin (Used in `DMartAdmin.sol`, `DMartStoreManagement.sol`)
 - `Ownable` from Zeppelin (Used in `DMartStore.sol`)
 - `RBAC`/`Roles` (unreleased Zeppelin package) (Used in `DMartAdmin.sol`)

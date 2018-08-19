# Design pattern decisions

## Circuit breaker / emergency stop
 - Used `Pausable` interface provided by zeppelin via EthPM to emergency stop important contracts
 - This means that the power returns back to the owner in the event that our code is 
 deemed susceptible to an attack

#### Where did I implement this?
 - DMartAdmin
 - DMartStoreManagement
 - DMartStore has its own type <!-- Explain -->

## Which design patterns did I choose?
 - Split admin/management/store
    - <!-- Explain -->
    - <!-- Why split the store out and not manage centrally -->
 - Store Factory 
    - <!-- Explain -->
 - Store Proxy
    - <!-- Explain -->
 - Struct storage saving
    - `uint16`



## Utilisation of libraries/EthPM
 - `Pausable` from Zeppelin (Used in `DMartAdmin.sol`, `DMartStoreManagement.sol`)
 - `Ownable` from Zeppelin (Used in `DMartStore.sol`)
 - `RBAC`/`Roles` (unreleased Zeppelin package) (Used in `DMartAdmin.sol`)

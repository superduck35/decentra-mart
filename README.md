# DecentraMart

## What is DecentraMart?
DecentraMart is a decentralised marketplace built to utilise the Ethereum blockchain as part of a developer program.
This being the case, and due to my other commitments, the UI is unrefined and functionality has been adjusted
with the main focus being on delivery of a usable smart contract system and the appropriate tests and documentation. 

In this application there is an Admin panel (`DmartAdmin.sol`) which manages the user roles (admins and store owners),
providing access control across the whole system. This contract, along with the other core contracts, are owned by the creator.
If you are a store owner then you can interact with the `DMartStoreManagement.sol` contract in order to create a store
via the `DMartStoreFactory.sol` which creates a Proxy using `Proxy.sol` pointing to our master copy of `DMartStore.sol`.
Having a proxy factory set up like this allows us to create versions of `DMartStore.sol` on the fly, for cheap, removing 
a lot of overhead and allowing store owners to own and manage multiple stores easily without causing conflicts!

Shoppers in DecentraMart can interact with the individual `DMartStore`'s which contain stock lists updated by the owners.


## Compile and deploy contracts
 - `truffle install` -> Install EthPM dependencies
 - `ganache-cli -p 8545` -> Run ganache instance on port 8545
 - `truffle migrate --network ganache` (may need node > 9)

## Run local dev server
 - `cd interface`
 - `npm install`
 - Configure environment to your chosen network (update contract addresses)
 - `npm run start`
 - visit http://localhost:4200

 ## Testing
 - Navigate to project root
 - `truffle install` -> Install EthPM dependencies
 - `truffle compile`
 - `truffle test`


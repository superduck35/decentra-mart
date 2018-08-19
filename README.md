# DecentraMart

## What is DecentraMart?
DecentraMart is a decentralised marketplace built to utilise the Ethereum blockchain as part of a developer program.
This being the case, and due to my other commitments, the UI is unrefined and functionality has been adjusted
with the main focus being on delivery of a usable smart contract system and the appropriate tests and documentation. 

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


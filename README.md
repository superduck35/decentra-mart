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


## First
 - Globally [Install node](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) 
 - Globally install `npm` (v6.4.0) (`sudo npm install -g npm`) globally on your machine via package manager


## Compile and deploy contracts
 - `npm install truffle-hdwallet-provider`
 - `truffle install` -> Install EthPM dependencies
 - `ganache-cli -p 8545` -> Run ganache instance on port 8545
 - `truffle migrate --network ganache` (may need node > 9)


 ## Testing
 - Navigate to project root
 - `npm install truffle-hdwallet-provider`
 - `npm install chai`
 - `truffle install` -> Install EthPM dependencies
 - `truffle compile`
 - ensure local network running `ganache-cli`
 - `truffle test`


## Run local dev server
 - `cd interface`
 - `npm install`
 - Use default settings (Rinkeby) or change `environment.ts` to your chosen network & update contract addresses..
 - `npm run start`
 - visit http://localhost:4200

 ### Install bugs
  - If you are getting some errors you are probably using the wrong version of `npm` (should be >= 6.4)



## Interacting with application

 - Load up the app as in `run local dev server` above (I recommend you stick with the default environment on Rinkeby)
 - To connect to Web3, your MetaMask must be connected to the correct network (as in the one in environment.ts... Rinkeby)
 - When you go to http://localhost:4200 you should see the front of the marketplace:

 ![Marketplace](https://github.com/alsco77/Decentra-Mart/blob/master/screenshots/loaded.png)


## Displaying your current metamask account
 - If your metamask is connected to the right network, you will see your address in the top right, next to your blockie
 - This adddress will update if you change your metamask account, or will show an error if you are not connected
 ![Address](https://github.com/alsco77/Decentra-Mart/blob/master/screenshots/address.png)


## Sign transactions using metamask
 - Try to purchase a product from the store.. follow these steps:
 1. Visit my store :)
  ![Step one](https://github.com/alsco77/Decentra-Mart/blob/master/screenshots/buy-1.png)
 2. Select a product to buy and hit 'BUY PRODUCT'
  ![Step two](https://github.com/alsco77/Decentra-Mart/blob/master/screenshots/buy-2.png)
 3. Sign the metamask transaction that appears!
  ![Step three](https://github.com/alsco77/Decentra-Mart/blob/master/screenshots/buy-3.png)
 3. If you done it right, your transaction should now be 'submitted' - congrats!
  ![Step four](https://github.com/alsco77/Decentra-Mart/blob/master/screenshots/buy-4.png)

## Seeing reflections to the contract state
 - After you purchase a product you will get visual feedback to tell you that the transaction is processing (see image above)
 - When your transaction is processed, __the stock of the product will update to reflect the new contract state__
   ![Purchase success](https://github.com/alsco77/Decentra-Mart/blob/master/screenshots/buy-5.png)


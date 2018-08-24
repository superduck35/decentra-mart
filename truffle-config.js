const HDWalletProvider = require("truffle-hdwallet-provider");

const gasPrice = 20000000000;

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gas: 6130000,
      network_id: '*'
    },
    ganache: {
      host: 'localhost',
      port: 8545,
      gas: 6130000,
      network_id: '*'
    },
    rinkeby: {
      network_id: 4,
      gas: 6130000,
      gasPrice,
      provider: function () {
        return new HDWalletProvider(process.env.WALLET_MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`)
      }
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

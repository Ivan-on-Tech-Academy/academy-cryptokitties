const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraApi = "c5f5c354a87f493e83e2ef49a48554fd";

const mnemonic = "grape venture toss era purchase park wash bargain chaos clock hen spatial";


module.exports = {

  networks: {
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
     ropsten: {
       provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/`+infuraApi),
       network_id: 3,       // Ropsten's id
       gas: 5500000,        // Ropsten has a lower block limit than mainnet
       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
     },
    },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.5.12",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}

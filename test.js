const Web3 = require('web3');
const web3 = new Web3('');
web3.eth.getBlock('latest').then(answer => console.log(answer))
web3.eth.getBlockNumber().then(blockNum => console.log(blockNum))
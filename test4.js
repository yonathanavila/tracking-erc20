const Web3 = require('web3');
const Utils = require("web3-utils");

var human_standard_token_abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "remaining",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "inputs": [
            {
                "name": "_initialAmount",
                "type": "uint256"
            },
            {
                "name": "_tokenName",
                "type": "string"
            },
            {
                "name": "_decimalUnits",
                "type": "uint8"
            },
            {
                "name": "_tokenSymbol",
                "type": "string"
            }
        ],
        "payable": false,
        "type": "constructor"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_extraData",
                "type": "bytes"
            }
        ],
        "name": "approveAndCall",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "version",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "type": "function"
    }
];

const getWeb3 = (rpc) => new Web3(rpc);

const getContract = (provider, abi, address) => {
    const web3 = getWeb3(provider);
    return new web3.eth.Contract(abi, address);
};

async function getERC20TransactionsByAddress(
    tokenContractAddress,
    tokenDecimals,
    address,
    fromBlock
) {
    // initialize the ethereum client
    /* const eth = new Eth(
        Eth.givenProvider || "ws://some.local-or-remote.node:8546"
    ); */

    const RPC_URL = "";
    const provider = getWeb3(RPC_URL);

    console.log("tokenContractAddress", tokenContractAddress);
    console.log("tokenDecimals", tokenDecimals);
    console.log("address", address);
    console.log("fromBlock", fromBlock);

    const currentBlockNumber = await provider.eth.getBlockNumber();
    // if no block to start looking from is provided, look at tx from the last day
    // 86400s in a day / eth block time 10s ~ 8640 blocks a day
    if (!fromBlock) fromBlock = currentBlockNumber - 8640;

    let options = {
        topics: [
            provider.utils.sha3('Transfer(address,address,uint256)')
        ]
    };

    let subscription = provider.eth.subscribe('logs', options);

    subscription.on('error', err => { console.log(err) });
    subscription.on('connected', nr => console.log('Subscription on ERC-20 started with ID %s', nr));
    subscription.on('data', event => {
        if (event.topics.length == 3) {
            let transaction = provider.eth.abi.decodeLog([{
                type: 'address',
                name: 'from',
                indexed: true
            }, {
                type: 'address',
                name: 'to',
                indexed: true
            }, {
                type: 'uint256',
                name: 'value',
                indexed: false
            }],
                event.data,
                [event.topics[1], event.topics[2], event.topics[3]]);

            const contractToken = getContract(provider, human_standard_token_abi, tokenContractAddress);

            if (transaction.from == address) {
                collectData(contractToken).then(contractData => {
                    const unit = Object.keys(provider.utils.unitMap).find(key => provider.utils.unitMap[key] === provider.utils.toBN(10).pow(provider.utils.toBN(contractData.decimals)).toString());
                    console.log(`Transfer of ${provider.utils.fromWei(transaction.value, unit)} ${contractData.symbol} from ${transaction.from} to ${transaction.to}`)
                })
            };


        }
    });
}

(async () => {
    const result = await getERC20TransactionsByAddress(
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        18,
        '',
        0
    )

    console.log(result)
})();

async function collectData(contract) {
    const [decimals, symbol] = await Promise.all([
        contract.methods.decimals().call(),
        contract.methods.symbol().call()
    ]);
    return { decimals, symbol };
}

import Web3 from "web3";

/**
 * It takes an RPC URL as an argument and returns a new instance of the Web3 library
 * @param {any} rpc - The RPC endpoint of the Ethereum node you want to connect to.
 */
export const getWeb3 = (rpc: any) => new Web3(rpc);

/**
 * It takes a provider, an ABI, and an address, and returns a contract
 * @param {any} provider - The provider you want to use.
 * @param {any} abi - The ABI of the contract you want to interact with.
 * @param {string} address - The address of the contract you want to interact with.
 * @returns A contract object.
 */
export const getContract = (provider: any, abi: any, address: string) => {
    const web3 = getWeb3(provider);
    return new web3.eth.Contract(abi, address);
};

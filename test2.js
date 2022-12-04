const ethers = require("ethers");
(async () => {
  const provider = new ethers.providers.JsonRpcProvider("");
  provider.connection.headers = { "x-qn-api-version": 1 };
  const heads = await provider.send("qn_getWalletTokenTransactions", {
    address: "",
    contract: "",
    page: 1,
    perPage: 10,
  });
  console.log(heads);
})();

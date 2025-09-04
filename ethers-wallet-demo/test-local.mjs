// test-local.js (NodeJS CommonJS)
import { createWallet, fetchAccountBalance } from "./dist/index.js";
import { ethers } from "ethers";

(async () => {
  const wallet = createWallet();
  console.log("TEST wallet:", wallet.address);

  const provider = new ethers.JsonRpcProvider("https://testnet.monsoon.rainfall.one"); // or your RPC URL
  const balance = await fetchAccountBalance(wallet.address, provider);
  console.log("Balance:", balance, "ETH");
})();

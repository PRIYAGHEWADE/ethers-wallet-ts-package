import { createWallet, fetchAccountBalance, fetchAccountTransactions } from "./wallet.js";
import { ethers } from "ethers";

async function main() {
  const wallet = createWallet();
  console.log("Wallet Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);

  const providerUrl = "https://testnet.monsoon.rainfall.one"; // FIX: pass string, not provider
  const balance = await fetchAccountBalance(wallet.address, providerUrl);
console.log("Balance:", balance);

const txs = await fetchAccountTransactions(providerUrl, wallet.address, 0, "latest");
console.log("Transactions:", txs.length);

}

main();

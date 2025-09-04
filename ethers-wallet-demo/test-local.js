import { createWallet, fetchAccountBalance } from "./dist/index.js";

async function main() {
  console.log("🔑 Wallet Created");
  const walletData = createWallet();

  console.log("Address:", walletData.address);
  console.log("Public Key:", walletData.publicKey);
  console.log("Private Key:", walletData.privateKey);

  // Use your RPC URL
  const providerUrl = "https://testnet.monsoon.rainfall.one";

  // Fetch balance
  const balance = await fetchAccountBalance(providerUrl, walletData.address);
  console.log("Balance:", balance, "ETH");
}

main();

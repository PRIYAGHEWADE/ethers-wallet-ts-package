// src/index.ts
import "dotenv/config";
import { createWallet, fetchAccountBalance, sendTransaction } from "ethers-wallet-ts-package";
import { ethers } from "ethers";

async function main() {
  // If you have a funded private key for testing, set FUNDED_PK in .env
  const fundedPk = process.env.FUNDED_PK?.trim();

  let walletAddress: string;
  let privateKey: string;

  if (fundedPk && fundedPk.length > 0) {
    privateKey = fundedPk;
    walletAddress = new ethers.Wallet(privateKey).address;
    console.log("🔑 Using funded private key from .env");
  } else {
    // creates a new ephemeral wallet (you'll need to fund this address)
    const walletData = createWallet();
    privateKey = walletData.privateKey;
    walletAddress = walletData.address;
    console.log("⚠️ New wallet created (no funds). Save the private key to reuse it for testing:");
    console.log("Address:", walletAddress);
    console.log("PrivateKey:", privateKey);
  }

  // provider (use env or default to Rainfall testnet)
  const providerUrl = process.env.RPC_URL || "https://testnet.monsoon.rainfall.one";

  // Fetch balance
  const balance = await fetchAccountBalance(walletAddress, providerUrl);
  console.log("Balance:", balance, "RDP");

  if (Number(balance) <= 0) {
    console.log("");
    console.log("Wallet has zero balance. FUND THIS ADDRESS before sending a tx.");
    console.log("Options:");
    console.log(" - If you created a new wallet above, copy the printed private key and address,");
    console.log("   fund the address using the network faucet or a funded account, then set FUNDED_PK in .env and re-run.");
    console.log(" - Or set FUNDED_PK in .env to a private key that already has test ETH.");
    return;
  }

  // Ready to send: recipient and amount can be provided by env
  const recipient = process.env.RECIPIENT || "0xRecipientAddressHere";
  const amountEth = process.env.AMOUNT || "0.001";

  console.log(`Sending ${amountEth} ETH -> ${recipient} via ${providerUrl} ...`);

  try {
    const tx = await sendTransaction(privateKey, providerUrl, recipient, amountEth);
    console.log("TX sent. Hash:", tx.hash);
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait(1);
    console.log("Tx confirmed. Block:", receipt.blockNumber, "Status:", receipt.status);
  } catch (err: any) {
    console.error("sendTransaction failed:", err?.message ?? err);
  }
}

main().catch(e => {
  console.error("Fatal:", e);
  process.exit(1);
});

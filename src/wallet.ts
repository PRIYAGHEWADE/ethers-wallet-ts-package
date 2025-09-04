import { WalletData } from "./types.js";
import { ethers } from "ethers";


/** Create a new random wallet */
export function createWallet(): WalletData {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    wallet,
  };
}

/** Fetch account balance (returns string ETH) */
export async function fetchAccountBalance(address: string, providerUrl: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

/** Fetch transactions (simple block scan) */
export async function fetchAccountTransactions(
  providerUrl: string,
  address: string,
  startBlock: number,
  endBlock: number | string = "latest"
): Promise<ethers.TransactionResponse[]> {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const txs: ethers.TransactionResponse[] = [];
  const latestBlock = endBlock === "latest" ? await provider.getBlockNumber() : Number(endBlock);

  for (let i = startBlock; i <= latestBlock; i++) {
    const block = await provider.getBlock(i, true);
    if (!block || !block.transactions) continue;

    for (const tx of block.transactions as unknown as ethers.TransactionResponse[]) {
      if (
        tx.from?.toLowerCase() === address.toLowerCase() ||
        (tx.to && tx.to.toLowerCase() === address.toLowerCase())
      ) {
        txs.push(tx);
      }
    }
  }
  return txs;
}

/** Send ETH transaction — NOTE PARAM ORDER! */
export async function sendTransaction(
  privateKey: string,
  providerUrl: string,   // 2nd
  to: string,            // 3rd
  amountEth: string      // 4th
): Promise<ethers.TransactionResponse> {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountEth),
  });

  return tx;
}

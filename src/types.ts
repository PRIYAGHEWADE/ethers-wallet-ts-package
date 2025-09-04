import { ethers } from "ethers";

export interface WalletData {
  address: string;
  privateKey: string;
  publicKey: string;
  wallet: ethers.HDNodeWallet;
}

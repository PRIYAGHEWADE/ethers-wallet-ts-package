🔹 1. Publish your npm package (if not done already)

If you haven’t yet published your package:

cd ethers-wallet-ts-package
npm login   # enter your npm credentials
npm publish --access public


👉 After this, your package will be available on npmjs.com (e.g., ethers-wallet-ts-package).

🔹 2. Create a demo project
mkdir ethers-wallet-demo
cd ethers-wallet-demo
npm init -y

🔹 3. Install dependencies

If you published the package to npm:

npm install ethers-wallet-ts-package ethers dotenv


👉 If you haven’t published yet but want to test locally:

npm install ../ethers-wallet-ts-package

🔹 4. Setup TypeScript
npm install typescript ts-node @types/node --save-dev
npx tsc --init

🔹 5. Project structure
ethers-wallet-demo/
 ├── src/
 │    └── index.ts
 ├── package.json
 ├── tsconfig.json
 └── .env

🔹 6. Add .env file
PRIVATE_KEY=your_test_private_key_here
RPC_URL=https://testnet.monsoon.rainfall.one
TO_ADDRESS=0x80d2442EC65A2e36b819d8559a90d6Ad197785A6

🔹 7. Example src/index.ts
import { createWallet, fetchAccountBalance, sendTransaction } from "ethers-wallet-ts-package";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("🔑 Using funded private key from .env");

  // Check balance
  const balance = await fetchAccountBalance(wallet.address, provider);
  console.log("Balance:", balance, "ETH");

  // Send transaction
  const txHash = await sendTransaction(wallet, process.env.TO_ADDRESS!, "0.001");
  console.log("TX sent. Hash:", txHash);
}

main();

🔹 8. Add start script in package.json
"scripts": {
  "start": "tsc && node dist/index.js"
}

🔹 9. Run the demo
npm start


✅ You should see:

🔑 Using funded private key from .env
Balance: 0.498 ETH
TX sent. Hash: 0x....
Tx confirmed. Block: ....

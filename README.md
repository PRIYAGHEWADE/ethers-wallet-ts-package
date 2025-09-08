🚀 TypeScript → npm Package CI/CD (Full Step-by-Step Guide)

This guide explains from scratch how to:

Create a TypeScript library project.

Build & test it locally.

Publish it manually to npm.

Automate publishing with GitHub Actions when you push a vX.Y.Z tag.

By the end, you’ll have a professional workflow:

npm version patch → git push --follow-tags → package automatically builds & publishes to npm.

0 — Prerequisites

✅ Node.js v18+ and npm installed (node -v && npm -v)
✅ GitHub account + repository created
✅ npm account (https://www.npmjs.com/
)
✅ Basic terminal knowledge

1 — Project Setup
# Create project folder
mkdir ethers-wallet-ts-package && cd ethers-wallet-ts-package

# Initialize Git
git init
git branch -M main

# Initialize npm project
npm init -y

Project structure
ethers-wallet-ts-package/
├─ src/
│  ├─ index.ts
│  ├─ wallet.ts
│  └─ types.ts
├─ dist/                  # compiled output (ignored in git)
├─ .github/workflows/     # GitHub Actions workflows
│  └─ publish-on-tag.yml
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ README.md

2 — Install Dependencies
npm install ethers
npm install --save-dev typescript

3 — Configure TypeScript

Create tsconfig.json:

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

4 — Source Files
src/types.ts
import { ethers } from "ethers";

export interface WalletData {
  address: string;
  privateKey: string;
  publicKey: string;
  wallet: ethers.Wallet;
}

src/wallet.ts
import { ethers } from "ethers";
import { WalletData } from "./types.js";

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

/** Fetch ETH balance */
export async function fetchAccountBalance(address: string, providerUrl: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

/** Send ETH transaction */
export async function sendTransaction(
  privateKey: string,
  providerUrl: string,
  to: string,
  amountEth: string
): Promise<ethers.TransactionResponse> {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountEth),
  });
}

src/index.ts
export { createWallet, fetchAccountBalance, sendTransaction } from "./wallet.js";
export type { WalletData } from "./types.js";

5 — .gitignore
node_modules/
dist/
*.tgz
.env
.DS_Store

6 — package.json

Edit to look like this:

{
  "name": "ethers-wallet-ts-package",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "build": "tsc",
    "test": "echo \"No tests\" && exit 0",
    "prepublishOnly": "npm run build && npm test"
  },
  "dependencies": {
    "ethers": "^6.15.0"
  },
  "devDependencies": {
    "typescript": "^5.9.2"
  },
  "publishConfig": {
    "access": "public"
  }
}

7 — Local Build & Check
# Install dependencies
npm install

# Build project
npm run build

# Preview publish contents
npm pack
tar -tzf ethers-wallet-ts-package-0.1.0.tgz


Test installing locally:

mkdir /tmp/pkg-test && cd /tmp/pkg-test
npm init -y
npm i ../ethers-wallet-ts-package/ethers-wallet-ts-package-0.1.0.tgz
node -e "import('ethers-wallet-ts-package').then(m => console.log(Object.keys(m)))"

8 — Manual Publish (optional)
Login & publish
npm login
npm publish --access public

9 — GitHub Actions CI/CD
Step 1 — Create npm Automation Token

Go to npmjs.com
 → Profile → Access Tokens.

Generate new Automation token.

Copy it (you won’t see it again).

Step 2 — Add token to GitHub

Repo → Settings → Secrets and variables → Actions → New repository secret

Name: NPM_TOKEN

Value: paste token

Step 3 — Create workflow file

Create .github/workflows/publish-on-tag.yml:

name: CI/CD for ethers-wallet-ts-package

on:
  push:
    tags:
      - "v*.*.*"

jobs:
  build-and-publish:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          registry-url: "https://registry.npmjs.org"
          cache: npm

      - run: npm ci
      - run: npm run build
      - run: npm test

      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

10 — Release & Auto-Publish
# Ensure clean working tree
git status

# Commit changes
git add .
git commit -m "Initial release"

# Bump version & create tag
npm version patch   # or minor / major

# Push with tags
git push origin main --follow-tags


This triggers the GitHub Action.
Check GitHub → Actions → workflow run.

11 — Verify on npm
npm info ethers-wallet-ts-package

12 — Daily Release Workflow

Make changes → commit

Run:

npm version patch
git push origin main --follow-tags


GitHub Actions builds & publishes automatically 🎉

13 — Troubleshooting

403 Forbidden → Check NPM_TOKEN is Automation type.

Tag not triggering workflow → Must be vX.Y.Z.

Already published version → Run npm version patch again.

Missing dist/ → Ensure "prepublishOnly": "npm run build && npm test" in package.json.

14 — Quick Commands Cheat-Sheet
# Build & pack
npm ci && npm run build && npm pack

# Publish manually
npm publish --access public

# Automated release
npm version patch
git push origin main --follow-tags


✅ Done!
Now your package auto-publishes on every version tag.

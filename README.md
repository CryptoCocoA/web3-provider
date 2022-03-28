# Web3 Provider

## Install

```bash
$ yarn add @crypto-cocoa/web3-provider
```

## How to use

```tsx
import { Web3Provider } from '@crypto-cocoa/web3-provider'

const ethereumMainnet = 1;
const contractName = 'nftContract';
const contractOptions = [
  {
    address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '',
    abi: ERC721.abi,
    name: contractName,
  }
]

function App() {
  return (
    <Web3Provider chainId={ethereumMainnet} contractOptions={contractOptions}>
      <App />
    </Web3Provider>
  )
}
```

```tsx
function Home() {
  const web3 = useWeb3();

  console.log(web3.contracts.updatable[contractName])

  return (
    <button onClick={web3.requestToConnect}>
      Connect Wallet
    </button>
  )
}
```

## Interfaces

```typescript
type Props = {
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.providers.JsonRpcSigner;
  accountAddress?: string;
  isConnected: boolean;
  isCorrectChain: boolean;
  contracts: Contracts;
  requestToConnect: () => Promise<void>;
  requestToChangeNetwork: () => Promise<void>;
}
```

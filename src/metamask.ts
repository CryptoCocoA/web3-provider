declare global {
  interface Window {
    ethereum: any
  }
}

export const checkMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

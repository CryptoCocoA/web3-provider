import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { checkMetaMaskInstalled } from "./metamask";
import { Contracts, Web3ContextType } from "./Web3Provider";

export type ContractOptions = {
  name: string;
  abi: any;
  address: string;
}[];

export const useEthers = (
  chainId: number,
  contractOptions: ContractOptions
): Web3ContextType => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isCorrectChain, setIsCorrectChain] = useState<boolean>(true);
  const [accountAddress, setAccountAddress] = useState<string>();
  const [contracts, setContracts] = useState<Contracts>({
    viewable: {},
    updatable: {},
  });

  useEffect(() => {
    init();
    setViewableContracts();

    window.ethereum.on("accountsChanged", function (accounts: string[]) {
      if (accounts.length) {
        setAccountAddress(accounts[0]);
      } else {
        setAccountAddress("");
        setIsConnected(false);
      }
    });

    window.ethereum.on("networkChanged", function () {
      location.reload();
    });
  }, []);

  useEffect(() => {
    setSignableContracts();
  }, [signer]);

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    if (!checkMetaMaskInstalled()) {
      throw new Error("You need to install metamask");
    }

    const accounts = await provider.listAccounts();
    if (accounts.length) {
      setIsConnected(true);
      setAccountAddress(accounts[0]);
    }

    if (Number(window.ethereum.networkVersion) !== chainId) {
      setIsCorrectChain(false);
    }

    const signer = provider.getSigner(0);
    setSigner(signer);
  };

  const setViewableContracts = () => {
    const _contracts: Contracts = { ...contracts };
    contractOptions.forEach((option) => {
      _contracts.viewable[option.name] = new ethers.Contract(
        option.address,
        option.abi,
        provider
      );
    });
    setContracts(_contracts);
  };

  const setSignableContracts = () => {
    if (!signer) return;

    const _contracts: Contracts = { ...contracts };
    contractOptions.forEach((option) => {
      _contracts.updatable[option.name] = new ethers.Contract(
        option.address,
        option.abi,
        signer
      );
    });
  };

  const requestToConnect = async () => {
    if (!provider) throw new Error("Provider is not initialized");

    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length) {
      setAccountAddress(accounts[0]);
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  const requestToChangeNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId.toString(16) }], // chainId must be in hexadecimal numbers
      });
      setIsCorrectChain(true);
    } catch (error) {
      throw error;
    }
  };

  return {
    accountAddress,
    provider,
    signer,
    contracts,
    isConnected,
    isCorrectChain,
    requestToConnect,
    requestToChangeNetwork,
  };
};

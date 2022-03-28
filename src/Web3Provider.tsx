import { ContractOptions, useEthers } from "./useEthers";
import React, { createContext, FC, useContext } from "react";
import { Contract, ethers } from "ethers";

export type Contracts = {
  viewable: {
    [key in string]: Contract;
  };
  updatable: {
    [key in string]: Contract;
  };
};

export type Web3ContextType = {
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.providers.JsonRpcSigner;
  accountAddress?: string;
  isConnected: boolean;
  isCorrectChain: boolean;
  contracts: Contracts;
  requestToConnect: () => Promise<void>;
  requestToChangeNetwork: () => Promise<void>;
};

export const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  isCorrectChain: true,
  contracts: {
    updatable: {},
    viewable: {},
  },
  requestToConnect: () => {
    throw new Error("requestToConnect function is not initialized");
  },
  requestToChangeNetwork: () => {
    throw new Error("requestToChangeNetwork function is not initialized");
  },
});

export const useWeb3 = () => useContext(Web3Context);

type Props = {
  chainId: number;
  contractOptions: ContractOptions;
};

export const Web3Provider: FC<Props> = ({
  children,
  chainId,
  contractOptions,
}) => {
  const web3 = useEthers(chainId, contractOptions);

  return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
};

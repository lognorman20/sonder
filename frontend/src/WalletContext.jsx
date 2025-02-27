import React, { createContext, useState } from "react";
import Web3 from "web3";

// Step 1: Create Context
export const WalletContext = createContext();

// Step 2: Create Provider Component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); 

        // Listen for account changes
        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccount(newAccounts[0] || null);
        });

      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

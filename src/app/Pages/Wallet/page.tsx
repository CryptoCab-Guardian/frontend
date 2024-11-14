
"use client";
import Navbar from "@/app/Navbar";
import React, { useEffect, useState } from "react";
import Web3 from "web3";

const UberWalletPage = () => {
  const [accountType, setAccountType] = useState(""); 
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>(""); 

  useEffect(() => {
    
    const storedAccount = localStorage.getItem("connectedAccount");
    if (storedAccount) {
      setCurrentAccount(storedAccount);
      initializeWeb3(storedAccount); 
    }
  }, []);

  const initializeWeb3 = async (account: string) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      try {
        
        const balanceInWei = await web3.eth.getBalance(account);
        const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
        setBalance(balanceInEther);

        // Determine the network type
        const networkId = Number(await web3.eth.net.getId());
        let networkName = "Unknown Network";
        if (networkId === 1) {
          networkName = "Ethereum Mainnet";
        } else if (networkId === 5) {
          networkName = "Goerli Testnet";
        } else if (networkId === 11155111) {
          networkName = "Sepolia Testnet";
        } else if (networkId === 3) {
          networkName = "Ropsten Testnet";
        } else if (networkId === 42) {
          networkName = "Kovan Testnet";
        }
        
        setAccountType(networkName);
      } catch (error) {
        console.error("Failed to initialize Web3:", error);
      }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-start mx-auto max-w-7xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-gray-600 font-medium mb-2">Balance</h2>
            <p className="text-3xl font-semibold">Ξ {balance}</p>
            <p className="text-gray-600 mt-2">
              {currentAccount
                ? `Connected account: ${currentAccount}`
                : "No account connected"}
            </p>
            <div className="mt-4">
              <label className="text-gray-600 text-md font-bold">Network Type</label>
              <p className="text-gray-100 text-md mt-1 bg-black p-1 rounded-md w-1/4 flex justify-center items-center">{accountType || "Unknown"}</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-gray-600 font-medium mb-2">Escrow Cash</h2>
            <p className="text-3xl font-semibold">Ξ 0.00</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UberWalletPage;




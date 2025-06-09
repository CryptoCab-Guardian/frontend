// Web3 utilities for MetaMask integration with Moralis
import { ethers } from 'ethers';
import Moralis from 'moralis';

// Initialize Moralis - call this in your app's entry point
export const initMoralis = async () => {
    if (!Moralis.Core.isStarted) {
        const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
        if (!apiKey) {
            console.error('Moralis API key is not set');
            return false;
        }

        try {
            await Moralis.start({
                apiKey: apiKey,
            });
            return true;
        } catch (error) {
            console.error('Failed to initialize Moralis:', error);
            return false;
        }
    }
    return true;
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
};

// Get the current Ethereum provider
export const getProvider = () => {
    if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed');
    }
    return new ethers.providers.Web3Provider(window.ethereum as any);
};

// Get the signer (connected wallet)
export const getSigner = () => {
    const provider = getProvider();
    return provider.getSigner();
};

// Connect to MetaMask
export const connectMetaMask = async () => {
    if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed');
    }

    try {
        // Request account access
        const accounts = await window.ethereum!.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    } catch (error) {
        console.error('Failed to connect to MetaMask:', error);
        throw error;
    }
};

// Get ETH to INR conversion rate (simplified approach - in production, use a proper price oracle)
export const getEthToInrRate = async (): Promise<number> => {
    try {
        // Using CoinGecko API to get current ETH/INR rate
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch ETH/INR rate');
        }

        const data = await response.json();
        return data.ethereum.inr;
    } catch (error) {
        console.error('Error fetching ETH/INR rate:', error);
        // Return a fallback rate
        return 240000; // Example rate, should be updated in production
    }
};

// Convert INR to ETH
export const convertInrToEth = (inrAmount: number, ethRate: number): string => {
    const ethAmount = inrAmount / ethRate;
    return ethAmount.toFixed(6); // 6 decimal places
};

// Make payment with MetaMask using Moralis
export const makeEthPayment = async (
    recipientAddress: string,
    amountInEth: string,
    chainId: string = '0xaa36a7' // Default to Sepolia testnet
): Promise<string> => {
    try {
        // Ensure Moralis is initialized
        await initMoralis();

        // Get the signer and connected account
        const signer = getSigner();
        const account = await signer.getAddress();

        // Estimate gas using ethers instead of Moralis
        // This avoids compatibility issues with Moralis API
        const provider = getProvider();
        const gasEstimate = await provider.estimateGas({
            to: recipientAddress,
            from: account,
            value: ethers.utils.parseEther(amountInEth)
        });

        // Add 20% buffer to gas estimate
        const gasLimit = gasEstimate.mul(12).div(10);

        // Prepare the transaction with MetaMask
        const tx = await signer.sendTransaction({
            to: recipientAddress,
            value: ethers.utils.parseEther(amountInEth),
            gasLimit
        });

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return receipt.transactionHash;
    } catch (error) {
        console.error('Payment failed:', error);
        throw error;
    }
};

// Get supported chains for the app
export const getSupportedChains = async () => {
    try {
        await initMoralis();
        // Prioritizing testnets at the top of the list
        return [
            { id: '0xaa36a7', name: 'Sepolia Testnet' },
            { id: '0x13881', name: 'Mumbai Testnet' },
            { id: '0x5', name: 'Goerli Testnet' },
            { id: '0x1', name: 'Ethereum Mainnet' },
            { id: '0x89', name: 'Polygon Mainnet' }
        ];
    } catch (error) {
        console.error('Error getting supported chains:', error);
        return [];
    }
};

// Switch to a specific network
export const switchNetwork = async (chainId: string): Promise<boolean> => {
    if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed');
    }

    try {
        await window.ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
        });
        return true;
    } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                // Add the network to MetaMask
                const networkParams = getNetworkParams(chainId);

                if (!networkParams) {
                    throw new Error(`Chain with ID ${chainId} not supported`);
                }

                await window.ethereum!.request({
                    method: 'wallet_addEthereumChain',
                    params: [networkParams],
                });
                return true;
            } catch (addError) {
                console.error('Error adding network to MetaMask:', addError);
                return false;
            }
        }
        console.error('Error switching network:', switchError);
        return false;
    }
};

// Helper function to get network parameters for different chains
const getNetworkParams = (chainId: string) => {
    switch (chainId) {
        case '0x1': // Ethereum Mainnet
            return {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://mainnet.infura.io/v3/'],
                blockExplorerUrls: ['https://etherscan.io'],
            };
        case '0x5': // Goerli Testnet
            return {
                chainId: '0x5',
                chainName: 'Goerli Testnet',
                nativeCurrency: {
                    name: 'Goerli Ether',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://goerli.infura.io/v3/'],
                blockExplorerUrls: ['https://goerli.etherscan.io'],
            };
        case '0xaa36a7': // Sepolia Testnet
            return {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                    name: 'Sepolia Ether',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
            };
        case '0x89': // Polygon Mainnet
            return {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/'],
            };
        case '0x13881': // Mumbai Testnet
            return {
                chainId: '0x13881',
                chainName: 'Mumbai Testnet',
                nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            };
        default:
            return null;
    }
};

// Verify transaction using ethers instead of Moralis
export const verifyTransaction = async (txHash: string, chainId: string = '0xaa36a7'): Promise<boolean> => {
    try {
        if (!txHash || txHash.trim() === '') {
            console.error('Invalid transaction hash provided');
            return false;
        }

        // Check if we need to switch networks to verify the transaction
        await ensureCorrectNetwork(chainId);

        // For testnets, we'll use ethers.js to verify transactions
        // This is more reliable than using Moralis for testnets
        const provider = getProvider();

        // First check if the transaction exists
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            console.warn('Transaction not found. It might be pending or invalid.');
            return false;
        }

        // Wait for the transaction to be mined if it's not already
        if (!tx.blockNumber) {
            console.log('Transaction is pending. Waiting for confirmation...');
            try {
                // Wait for transaction with a timeout of 15 seconds
                const receipt = await Promise.race([
                    provider.waitForTransaction(txHash, 1),
                    new Promise<null>((resolve) => setTimeout(() => resolve(null), 15000))
                ]);

                if (!receipt) {
                    console.warn('Transaction verification timed out');
                    return false;
                }

                return receipt ? (receipt as any).status === 1 : false;
            } catch (error) {
                console.error('Error waiting for transaction:', error);
                return false;
            }
        }

        // If the transaction is already mined, get the receipt
        const receipt = await provider.getTransactionReceipt(txHash);

        if (!receipt) return false;

        // Status 1 means successful transaction
        return receipt.status === 1;
    } catch (error) {
        console.error('Error verifying transaction:', error);
        return false;
    }
};

// Helper function to ensure we're on the correct network for transaction verification
const ensureCorrectNetwork = async (chainId: string): Promise<boolean> => {
    try {
        // Only attempt to switch if MetaMask is installed
        if (!isMetaMaskInstalled()) return false;

        const ethereum = window.ethereum as any;
        const currentChainId = await ethereum.request({ method: 'eth_chainId' });

        // If already on the correct network, return true
        if (currentChainId === chainId) return true;

        // Otherwise, try to switch networks
        return await switchNetwork(chainId);
    } catch (error) {
        console.error('Error ensuring correct network:', error);
        return false;
    }
};

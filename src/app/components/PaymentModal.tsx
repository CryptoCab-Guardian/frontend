"use client";
import { useState, useEffect } from 'react';
import { FaEthereum, FaTimes, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
    getEthToInrRate,
    convertInrToEth,
    makeEthPayment,
    connectMetaMask,
    isMetaMaskInstalled,
    initMoralis,
    getSupportedChains,
    switchNetwork
} from '@/app/utils/web3';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (txHash: string, chainId: string) => void;
    amount: string;
    recipientAddress: string;
    rideId: string;
}

interface Chain {
    id: string;
    name: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    amount,
    recipientAddress,
    rideId
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [ethAmount, setEthAmount] = useState('0');
    const [ethRate, setEthRate] = useState(0);
    const [metaMaskConnected, setMetaMaskConnected] = useState(false);
    const [selectedChain, setSelectedChain] = useState<string>('0xaa36a7'); // Default to Sepolia testnet
    const [availableChains, setAvailableChains] = useState<Chain[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Initialize Moralis
            initMoralis();

            // Check if MetaMask is installed
            if (!isMetaMaskInstalled()) {
                toast.error('MetaMask is not installed. Please install MetaMask extension to make payments.');
                return;
            }

            // Load supported chains
            loadSupportedChains();

            // Load ETH/INR conversion rate
            fetchEthRate();

            // Check if already connected to MetaMask
            checkMetaMaskConnection();
        }
    }, [isOpen]);

    const loadSupportedChains = async () => {
        const chains = await getSupportedChains();
        setAvailableChains(chains);
    };

    const fetchEthRate = async () => {
        try {
            const rate = await getEthToInrRate();
            setEthRate(rate);

            // Parse numeric amount from INR string
            const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericAmount)) {
                const ethValue = convertInrToEth(numericAmount, rate);
                setEthAmount(ethValue);
            }
        } catch (error) {
            console.error('Error fetching ETH rate:', error);
            toast.error('Failed to get current ETH exchange rate');
        }
    };

    const checkMetaMaskConnection = async () => {
        try {
            if (isMetaMaskInstalled()) {
                // Type assertion to assure TypeScript that window.ethereum exists
                const ethereum = window.ethereum as any;
                if (ethereum && ethereum.selectedAddress) {
                    setMetaMaskConnected(true);
                }
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
        }
    };

    const handleConnectMetaMask = async () => {
        try {
            setIsLoading(true);
            await connectMetaMask();
            setMetaMaskConnected(true);
            toast.success('MetaMask connected successfully');
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            toast.error('Failed to connect to MetaMask');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNetworkSwitch = async (chainId: string) => {
        try {
            setIsLoading(true);
            const success = await switchNetwork(chainId);
            if (success) {
                setSelectedChain(chainId);
                toast.success('Network switched successfully');
            } else {
                toast.error('Failed to switch network');
            }
        } catch (error) {
            console.error('Network switch error:', error);
            toast.error(`Failed to switch network: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            setIsLoading(true);

            // Make payment through MetaMask using Moralis with the selected chain
            const txHash = await makeEthPayment(recipientAddress, ethAmount, selectedChain);

            // Add a delay to ensure transaction is processed
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Payment successful!');
            onSuccess(txHash, selectedChain);
            onClose();
        } catch (error: any) {
            console.error('Payment failed:', error);

            // Handle different types of errors with more specific messages
            if (error.code === 4001) {
                // User rejected the transaction
                toast.error('Transaction was rejected');
            } else if (error.code === -32603) {
                // Internal JSON-RPC error
                toast.error('Transaction failed: Insufficient funds or network issue');
            } else if (error.message && error.message.includes('insufficient funds')) {
                toast.error('Insufficient funds in your wallet. Please add more ETH to continue.');
            } else if (error.message && error.message.includes('gas')) {
                toast.error('Gas estimation failed. The transaction might fail or your network is congested.');
            } else {
                toast.error(`Payment failed: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Pay for Ride</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Testnet Mode</span>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Amount (INR)</p>
                        <p className="text-2xl font-bold">{amount}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Amount (ETH)</p>
                        <div className="flex items-center">
                            <FaEthereum className="text-blue-600 mr-1" size={20} />
                            <p className="text-2xl font-bold">{ethAmount}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">1 ETH = ₹{ethRate.toLocaleString()}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Recipient</p>
                        <p className="font-mono text-sm break-all">{recipientAddress}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">Network</p>
                            {metaMaskConnected && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                    Connected
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {availableChains.map((chain) => (
                                <button
                                    key={chain.id}
                                    onClick={() => handleNetworkSwitch(chain.id)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                                        ${selectedChain === chain.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {chain.name}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            For testing, use Sepolia or Mumbai testnet. You can get test ETH from faucets.
                        </p>
                    </div>

                    {!metaMaskConnected ? (
                        <button
                            onClick={handleConnectMetaMask}
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg font-semibold transition ${isLoading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}
                        >
                            {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                        </button>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg font-semibold transition ${isLoading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isLoading ? 'Processing Payment...' : 'Pay Now'}
                        </button>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                        Payment is processed securely through MetaMask.
                        Make sure you have sufficient ETH in your wallet.
                    </p>

                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 mt-2">
                        <p className="font-medium mb-1">📘 Testing on Testnets</p>
                        <p>This app uses Ethereum testnets for payments. You can get free test ETH from:</p>
                        <ul className="list-disc ml-4 mt-1">
                            <li><a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="underline">Sepolia Faucet</a></li>
                            <li><a href="https://mumbaifaucet.com/" target="_blank" rel="noopener noreferrer" className="underline">Mumbai Faucet</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

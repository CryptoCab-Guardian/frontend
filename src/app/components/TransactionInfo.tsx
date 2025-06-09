"use client";
import { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { verifyTransaction } from '@/app/utils/web3';

interface TransactionInfoProps {
    txHash: string;
    chainId: string;
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({ txHash, chainId }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [verificationAttempts, setVerificationAttempts] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const verifyTx = async () => {
            try {
                if (!txHash) {
                    setIsVerifying(false);
                    setErrorMessage("No transaction hash provided");
                    return;
                }

                setIsVerifying(true);
                setErrorMessage(null);

                // Wait a bit to ensure the transaction has time to be indexed
                await new Promise(resolve => setTimeout(resolve, 3000));

                const verified = await verifyTransaction(txHash, chainId);
                setIsVerified(verified);

                // If not verified on first attempt, try again after a delay
                if (!verified && verificationAttempts < 2) {
                    setTimeout(() => {
                        setVerificationAttempts(prev => prev + 1);
                    }, 10000); // Try again after 10 seconds
                }
            } catch (error) {
                console.error('Error verifying transaction:', error);
                setIsVerified(false);
                setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
            } finally {
                setIsVerifying(false);
            }
        };

        if (txHash && (verificationAttempts === 0 || verificationAttempts < 3)) {
            verifyTx();
        }
    }, [txHash, chainId, verificationAttempts]);

    const getExplorerUrl = () => {
        switch (chainId) {
            case '0x1': // Ethereum Mainnet
                return `https://etherscan.io/tx/${txHash}`;
            case '0x5': // Goerli Testnet
                return `https://goerli.etherscan.io/tx/${txHash}`;
            case '0xaa36a7': // Sepolia Testnet
                return `https://sepolia.etherscan.io/tx/${txHash}`;
            case '0x89': // Polygon Mainnet
                return `https://polygonscan.com/tx/${txHash}`;
            case '0x13881': // Mumbai Testnet
                return `https://mumbai.polygonscan.com/tx/${txHash}`;
            default:
                return `https://etherscan.io/tx/${txHash}`;
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mt-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
                {isVerifying ? (
                    <div className="flex items-center text-blue-600">
                        <FaClock className="mr-1" />
                        <span className="text-sm">Verifying{Array(verificationAttempts + 1).fill('.').join('')}</span>
                    </div>
                ) : isVerified ? (
                    <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-1" />
                        <span className="text-sm">Verified</span>
                    </div>
                ) : (
                    <div className="flex items-center text-yellow-600">
                        <FaExclamationTriangle className="mr-1" />
                        <span className="text-sm">
                            {verificationAttempts >= 2 ? 'Verification Failed' : 'Pending'}
                        </span>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500">Transaction Hash</p>
                <div className="flex items-center justify-between">
                    <p className="font-mono text-sm truncate">{txHash}</p>
                    <a
                        href={getExplorerUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                        <FaExternalLinkAlt size={14} />
                    </a>
                </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500">Network</p>
                <p className="text-sm">
                    {chainId === '0x1' ? 'Ethereum Mainnet' :
                        chainId === '0x5' ? 'Goerli Testnet' :
                            chainId === '0xaa36a7' ? 'Sepolia Testnet' :
                                chainId === '0x89' ? 'Polygon Mainnet' :
                                    chainId === '0x13881' ? 'Mumbai Testnet' : 'Unknown Network'}
                </p>
            </div>

            <p className="text-xs text-gray-500 mt-2">
                You can view this transaction on the blockchain explorer by clicking the link above.
                {!isVerified && !isVerifying && (
                    <span className="block mt-1 text-yellow-600">
                        {errorMessage ? errorMessage :
                            verificationAttempts >= 2 ?
                                "Transaction could not be verified after multiple attempts. It might still be processing." :
                                "Transaction might still be processing. Check back in a few minutes."}
                    </span>
                )}
            </p>
        </div>
    );
};

export default TransactionInfo;

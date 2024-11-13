'use client'

import { useEffect, useState } from 'react';
import Web3 from 'web3';

declare var window: any

export default function MetaMaskAuth() {
    const [accounts, setAccounts] = useState<Array<string>>([]);
    const [currentAccount, setCurrentAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function checkMetaMaskAvailability() {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);
                setCurrentAccount(accounts[0]);

                // Listen for account changes
                window.ethereum.on('accountsChanged', (newAccounts: Array<string>) => {
                    setAccounts(newAccounts);
                    setCurrentAccount(newAccounts[0]);
                });
            } catch (err) {
                setError('User denied account access');
            }
        } else {
            setError('MetaMask is not installed');
        }
    };

    function switchAccount(account: string) {
        setCurrentAccount(account)
    };

    function disconnect() {
        setAccounts([]);
        setCurrentAccount(null);
        setError(null);
    };

    useEffect(() => {
        checkMetaMaskAvailability();

        // Cleanup event listener on component unmount
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', (newAccounts: Array<string>) => {
                    setAccounts(newAccounts);
                    setCurrentAccount(newAccounts[0]);
                });
            }
        };
    }, []);


    return (
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">MetaMask Authentication</h1>
            {currentAccount ? (
                <div>
                    <p className="mb-4 break-all">
                        <strong>Connected as:</strong> {currentAccount}
                    </p>
                    <div className="mb-4">
                        <label htmlFor="accounts" className="block mb-2 text-sm font-medium text-gray-700">Switch Account</label>
                        <select
                            id="accounts"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => switchAccount(e.target.value)}
                            value={currentAccount}
                        >
                            {accounts.map((account, idx) => (
                                <option key={idx} value={account}>
                                    {account}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={disconnect}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <div>
                    <button
                        onClick={checkMetaMaskAvailability}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 mb-4"
                    >
                        Connect MetaMask
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            )}
        </div>
    );
};
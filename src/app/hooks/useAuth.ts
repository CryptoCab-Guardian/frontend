"use client";
import { create } from 'zustand';
import Web3 from 'web3';

interface AuthState {
	isConnected: boolean;
	currentAccount: string | null;
	userRole: string | null;
	balance: string;
	networkType: string;
	setConnected: (account: string) => Promise<void>;
	setDisconnected: () => void;
	setUserRole: (role: string) => void;
	initializeWeb3: (account: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
	isConnected: false,
	currentAccount: null,
	userRole: null,
	balance: '0',
	networkType: 'Unknown Network',

	setConnected: async (account: string) => {
		localStorage.setItem('connectedAccount', account);
		localStorage.setItem('walletConnected', 'true');
		set({ isConnected: true, currentAccount: account });

		// Initialize Web3 when connecting
		const state = get();
		await state.initializeWeb3(account);
	},

	setDisconnected: () => {
		localStorage.removeItem('connectedAccount');
		localStorage.removeItem('walletConnected');
		localStorage.removeItem('userRole');
		set({
			isConnected: false,
			currentAccount: null,
			userRole: null,
			balance: '0',
			networkType: 'Unknown Network'
		});
	},

	setUserRole: (role: string) => {
		localStorage.setItem('userRole', role);
		set({ userRole: role });
	},

	initializeWeb3: async (account: string) => {
		if (typeof window.ethereum !== "undefined") {
			const web3 = new Web3(window.ethereum);
			try {
				// Get balance
				const balanceInWei = await web3.eth.getBalance(account);
				const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");

				// Get network type
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

				set({
					balance: balanceInEther,
					networkType: networkName
				});
			} catch (error) {
				console.error("Failed to initialize Web3:", error);
			}
		}
	},
}));
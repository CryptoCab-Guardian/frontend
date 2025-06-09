"use client";
import { useEffect } from 'react';
import { initMoralis } from '@/app/utils/web3';

export function useMoralisInit() {
    useEffect(() => {
        // Initialize Moralis when the app starts
        const initialize = async () => {
            try {
                await initMoralis();
                console.log('Moralis initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Moralis:', error);
            }
        };

        initialize();
    }, []);

    return null;
}

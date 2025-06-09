// Extending the Window interface to include Ethereum provider
interface Window {
    ethereum?: {
        isMetaMask?: boolean;
        request: (request: { method: string; params?: any[] }) => Promise<any>;
        selectedAddress?: string;
        on: (event: string, callback: (...args: any[]) => void) => void;
        removeListener: (event: string, callback: (...args: any[]) => void) => void;
        isConnected: () => boolean;
    };
}

import { FaEthereum, FaWallet } from "react-icons/fa";

interface WalletDisplayProps {
  balance: string | number;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ balance }) => {
  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg">
      <FaWallet className="text-yellow-400" />
      <div className="flex items-center">
        <span className="text-sm mr-2">Balance:</span>
        <div className="flex items-center font-semibold">
          <FaEthereum className="text-blue-400 mr-1" />
          <span>{Number(balance).toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};
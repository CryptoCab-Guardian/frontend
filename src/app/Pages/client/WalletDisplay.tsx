import React from 'react';

interface WalletDisplayProps {
  balance: string | number;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ balance }) => {
  return (
    <div className="flex flex-col items-end mt-8 mb-6">
      <div className="text-lg font-bold">Current Amount:</div>
      <div className="text-lg text-green-600">
        Ξ {Number(balance).toFixed(4)}
      </div>
    </div>
  );
};

export default WalletDisplay;
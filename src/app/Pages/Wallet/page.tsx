"use client"
import React, { useState } from "react";

const UberWalletPage = () => {
  const [accountType, setAccountType] = useState("");

  const handleAccountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-start mx-auto max-w-7xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-gray-600 font-medium mb-2">Balance</h2>
            <p className="text-3xl font-semibold">₹0.00</p>
            <p className="text-gray-600 mt-2">
              Add the bank account where you want to receive payouts
            </p>
            <div className="mt-4">
              <label className="text-gray-600 text-sm">Account Type</label>
              <div className="relative mt-2">
                <select
                  value={accountType}
                  onChange={handleAccountTypeChange}
                  className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:outline-none focus:ring focus:ring-gray-200 p-2"
                >
                  <option value="" disabled>Select Account Type</option>
                  <option value="Selenium">Selenium</option>
                  <option value="Etherium">Etherium</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-gray-600 font-medium mb-2">Escrow Cash</h2>
            <p className="text-3xl font-semibold">₹0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UberWalletPage;

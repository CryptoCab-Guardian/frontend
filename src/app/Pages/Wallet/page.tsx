import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const UberWalletPage = () => {
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
            <button className="flex items-center justify-center mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg">
              <AiOutlinePlus className="mr-2" />
              Add bank account
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-gray-600 font-medium mb-2">Uber Cash</h2>
            <p className="text-3xl font-semibold">₹0.00</p>
            <button className="flex items-center justify-center mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg">
              <AiOutlinePlus className="mr-2" />
              Gift card
            </button>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mb-8 md:ml-52 ml-5 ">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <button className="flex items-center mt-2 text-black text-sm font-medium">
            <AiOutlinePlus className="mr-2" />
            Add Payment Method
          </button>
        </div>

        {/* Profiles Section */}
        <div className="md:ml-52 ml-5">
          <h3 className="text-lg font-semibold">Profiles</h3>
          {/* Placeholder for profile items or other UI elements */}
        </div>
      </div>

      {/* Balance and Uber Cash Cards */}
    </div>
  );
};

export default UberWalletPage;

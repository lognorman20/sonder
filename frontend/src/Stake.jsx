import { TextField } from "@mui/material";
import { useState, useContext } from "react";
import { WalletContext } from "./WalletContext";


export default function Stake() {
const { account } = useContext(WalletContext);
  const [address, setAddress] = useState("");
  const [api, setapi] = useState("");
  const [stakedAmount, setstakedAmount] = useState(0);
  const [status, setStatus] = useState("Awaiting Upload");
  const [verifications, setVerifications] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleStake = async () => {
    try {
      //call stake agent in backend
        const response = await fetch('http://localhost:3000/stake_agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ api: api, user: account, amount: stakedAmount}),
        });
  
        const result = await response.json();
        alert(result.message);
      } catch (error) {
        console.error('Error:', error);
      }
      
  };

  return (
<div className="bg-gray-900 text-gray-100 w-screen min-h-screen p-6 overflow-x-hidden">
{/* Make this div full width */}
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Sonder</h1>
        <p className="text-gray-400">May the best agent win</p>
      </div>
  
      {/* Upload Card */}
      <div className="w-full bg-gray-800 rounded-lg border border-gray-700 mb-6 p-6">
  
        <h2 className="text-xl font-semibold text-white mb-6 mt-6">Enter API endpoint to call AI agent</h2>
  
        <input 
          type="text" 
          placeholder="https://..." 
          className="w-full mt-2 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          value={api}
          onChange={(e) => setapi(e.target.value)}
        />

    <h2 className="text-xl font-semibold text-white mb-6 mt-6">Enter amount to stake (in ETH): </h2>

        <input 
        type="number"
        placeholder="0.00x ETH"
        className="w-full mt-2 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
        value={stakedAmount}
        onChange={(e) => setstakedAmount(e.target.value)}
        />


  
        {/* Upload Button */}
        <button
          onClick={handleStake}
          className={`w-full mt-6 py-3 px-4 rounded-md font-medium ${
            address 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          } transition-colors`}
        >
         Stake ETH!
        </button>
      </div>

    </div>
  </div>
  
  );
}
import { TextField } from "@mui/material";
import { useState, useContext } from "react";
import { WalletContext } from "./WalletContext";

export default function CreateAIAgent() {
  const { account } = useContext(WalletContext);
  const [name, setName] = useState("");
  const [api, setapi] = useState("");
  const [apiKey, setapiKey] = useState("");
  const [status, setStatus] = useState("Awaiting Upload");
  const [verifications, setVerifications] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleCreate = async () => {

    //ensure an api is included
    if (!api) return;

    //ensure an account is included
    if (!account) {
      alert('Please sign in before uploading an agent.')
      return;
    }

    if (api) {

      try {
        //call create agent in backend
        const response = await fetch('http://localhost:3000/create_agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: name, api: api, key: apiKey, owner: account, type: "api"}),
        });
  
        const result = await response.json();
        alert(result.message);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    //reset variables in form
    setName("");
    setapi("");
    setapiKey("");
    
    };

  return (
<div className="bg-gray-900 text-gray-100 w-screen min-h-screen p-6 overflow-x-hidden">
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Sonder</h1>
        <p className="text-gray-400">May the best agent win</p>
      </div>
  
    {/* Upload card*/}
      <div className="w-full bg-gray-800 rounded-lg border border-gray-700 mb-6 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Enter Name for AI Agent</h2>
  
        <input 
          type="text" 
          placeholder="Agent Name" 
          className="w-full mt-2 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
  
        <h2 className="text-xl font-semibold text-white mb-6 mt-6">Enter API endpoint to call AI agent</h2>
  
        <input 
          type="text" 
          placeholder="https://..." 
          className="w-full mt-2 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          value={api}
          onChange={(e) => setapi(e.target.value)}
        />


    
    <h2 className="text-xl font-semibold text-white mb-6 mt-6">Enter API Key to call AI agent API </h2>
      
      <input 
        type="password" 
        placeholder="XXXX...." 
        className="w-full mt-2 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
        value={apiKey}
        onChange={(e) => setapiKey(e.target.value)}
      />

  
        {/* Upload Button */}
        <button
          onClick={handleCreate}
          className= "w-full mt-6 py-3 px-4 rounded-md text-white font-medium" 
        >
          Upload Agent
        </button>
      </div>

      
    </div>
  </div>
  
  );
}
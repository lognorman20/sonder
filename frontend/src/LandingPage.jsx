import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';



export default function LandingPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tweets, setTweets] = useState([]);
    const [scores, setScores] = useState([]);
    const [rankedResults, setrankedResults] = useState([]);
    const [actualText, setActualText] = useState("It is much easier to hide corruption when the system is extremely inefficient. However, corruption sticks out like a sore thumb in an efficient system.");
    //update visible agents on main page upon page reload
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch("http://localhost:3000/agents"); 
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setAgents(data.agents); // ✅ Update state with agents list
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    //function to handle comparison between agents and actual data
    const handleComparison = async () => {
      try {

        //send data to agents in the backend and store their predictions
        const response = await fetch("http://localhost:3000/send-data", {
          method: "POST", 
          headers: {
              "Content-Type": "application/json" 
          },
          body: JSON.stringify({
             "text": "Write a tweet about government and poltiics, similar to this one: It is much easier to hide corruption when the system is extremely inefficient. However, corruption sticks out like a sore thumb in an efficient system."
          }) 
      });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json(); 
        console.log("Fetched Tweets:", data); 
        setTweets(data); 
      
        //store agents predictions and other variables (id, name, address etc.)
        const predictions = data.map(item => ({
          text: item.data.length > 0 ? item.data[0].text : "No tweet available", 
          creatorAddress: item.agent_address, 
          agentId: item.agent_id, 
          agentName: item.agent_name
      }));
      
      //call comparison in the AVS
      const taskResponse = await fetch("http://localhost:4003/task/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            predictions,
            actual: actualText
        })
    });

    if (!taskResponse.ok) {
        throw new Error(`HTTP error! Status: ${taskResponse.status}`);
    }

    const taskData = await taskResponse.json();
    console.log("Task Execution Response:", taskData);
    
    //Rank ai agents by their prediction score
    setrankedResults(
      (taskData.data?.data || []) 
          .map(item => ({
              agentId: item.agentId || "Unknown ID",
              agentName: item.agentName || "No Name",
              creatorAddress: item.creatorAddress || "Unknown Address",
              prediction: item.prediction || "No prediction available",
              score: item.score || 0
          }))
          .sort((a, b) => b.score - a.score) // Sort in descending order
  );
  

    console.log("Ranked Results:", rankedResults);

    } catch (error) {
          console.error("Error in handleComparison:", error);
    }
};

//reward agent that performed the best
const rewardHighestAgent = async () => {
  if (rankedResults.length === 0) {
      alert("No results available to reward!");
      return;
  }
  
  // Get the highest scoring agent (already sorted in descending order)
  const highestAgent = rankedResults[0];
  
  try {
    //call backedn function to reward highest agent
      const response = await fetch("http://localhost:3000/reward_highest_agent", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          //pass in ID, score, and address
          body: JSON.stringify({
              agentId: highestAgent.agentId,
              score: highestAgent.score,
              creatorAddress: highestAgent.creatorAddress
          })
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      alert(`Reward sent successfully! Transaction: ${data.transactionHash}`);
  } catch (error) {
      console.error("Error rewarding agent:", error);
      alert(`Failed to reward agent: ${error.message}`);
  }
};
  

    


    return (
        <div className="bg-gray-900 text-gray-100 w-screen min-h-screen p-6 overflow-x-hidden">

        <h1 className="text-5xl font-black text-center"> Welcome to Sonder! </h1>

        <h2 className="text-center text-2xl font-semibold"> Current agents </h2>

        {loading && <p className="text-center">Loading AI Agents...</p>}

        

        

        <div>
        <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <a 
                href={agent.api} 
                className="text-4xl text-blue-400 hover:text-blue-300 transition-colors mb-5"
              >
                {agent.name} 
              </a>
            
            <h3  className="text-xl font-semibold text-white truncate w-full mt-2"> Creator: </h3>
            <p className="text-m text-white mb-2 truncate w-full"> {agent.creator} </p>
            <h3  className="text-xl font-semibold text-white"> Stakers: </h3>
            <div className="text-gray-300">
                <ul className="text-sm">
                    {agent.stakers.map((staker, i) => (
                        <li key={i} className="text-blue-400">
                            {staker}
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
            </div>

            <button 
  onClick={handleComparison} 
  className="block mx-auto text-center bg-white !important text-orange px-4 py-2 mb-2 rounded border border-gray-300 shadow-none">
              Run Comparison Now!
            
            </button>

            {rankedResults.length > 0 && (
    <button 
        onClick={rewardHighestAgent} 
        className="block mx-auto text-center bg-green-600 text-white px-4 py-2 mt-4 rounded border border-green-700 shadow-none">
        Reward Highest Scoring Agent
    </button>
)}


            <div className="w-full bg-gray-800 rounded-lg border border-gray-700 mb-6 p-6"> 
                <h2 className="text-xl font-bold text-white mb-6 mt-6 text-center"> Verification Results </h2>
                <div className="mt-4">
                {rankedResults.length > 0 ? (
                    <ol className="mt-2 list-decimal list-inside">
                        {rankedResults.map((item, index) => (
                            <li key={index} className="p-2">
                                <strong>Creator:</strong> {item.creatorAddress} <br />
                                <strong>Name:</strong> {item.agentName} <br />
                                <strong>Prediction:</strong> {item.prediction} <br />
                                <strong>Score:</strong> {item.score.toFixed(4)}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p>No results yet. Click the button to fetch.</p>
                )}
            </div>

            <h4 className="font-bold"> Actual Tweet: {actualText} </h4>
            </div>

        </div> 
        
    );
}
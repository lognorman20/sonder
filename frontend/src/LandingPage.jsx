import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';



export default function LandingPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tweets, setTweets] = useState([]);
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


    const handleComparison = async () => {
      try {
        const response = await fetch("http://localhost:3000/send-data", {
          method: "POST", // Specify the request method
          headers: {
              "Content-Type": "application/json" // Specify the content type
          },
          body: JSON.stringify({
             "text": "tell me about current events in a tweet"
          }) 
      });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json(); // ✅ Parse JSON
        console.log("Fetched Tweets:", data); // Debugging
        setTweets(data); // ✅ Set state with fetched tweets
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };
  

    


    return (
        <div className="bg-gray-900 text-gray-100 w-screen min-h-screen p-6 overflow-x-hidden">

        <h1 className="text-5xl font-black text-center"> Welcome to Sonder! </h1>

        <h2 className="text-center text-2xl font-semibold"> Current agents </h2>

        {/* ✅ Show loading state */}
        {loading && <p className="text-center">Loading AI Agents...</p>}

        

        <div>
        <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow">
            {/* <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3> */}
            {/* <p className="text-gray-400 mb-4">{card.description}</p> */}
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

            <button onClick={handleComparison} className="block mx-auto text-center bg-blue-500 text-black px-4 py-2 rounded">
            Run Comparison Now!
            
            </button>

        </div> 
        
    );
}
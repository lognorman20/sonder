require('dotenv').config();
const { ethers } = require('ethers');

const express = require('express')
const cors = require('cors')
const User = require('./User')
const Agent = require('./Agent')
const axios = require('axios');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express()
const port = 3000



//agent class: API URL, Creator (user object), list of user objects who have staked into it


//user: wallet address 

const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAFf5ygEAAAAA9zxHDfY%2Fliw4HZxXjwg8fMfyHr4%3D2yoU3Y0S9DjQwK8TpBQb3rOSL3l7fH46rDPHJwY0G5M71XKGt1'; 


// Load Ethereum Provider (Alchemy, Infura, or Local Node)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Update with your provider URL

// Load Wallet (Use Private Key - Ensure .env is used for security)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract Details
const contractAddress = "0xca2B956b96968F749d21D59cB60288d5C49fA6E0";  // Replace with your deployed contract address
const contractABI = [
    "function depositFee(string memory agentId) public payable",
    "function stakeInAgent(string memory agentId) public payable",
    "function getUserDeposit(address user) public view returns (uint256)",
    "function reward(string memory agentId, int256 score, address creator) public"
];

// Create Contract Instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);



const users = [];

const agents = [
];

app.use(cors({ 
    origin: "http://localhost:5173", // Adjust to match your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
  }));
  
app.use(express.json());
app.use(bodyParser.json());

app.post('/create_agent', async(req, res) =>  {
    const {name, api, key, owner, type} = req.body;
    const user = new User(owner);
    const agent = new Agent(name, api, key, user, [user]);

    const depositAmount = ethers.parseEther("0.1"); 

    try {
        // Send the deposit transaction to the contract
        const tx = await contract.depositFee(name, { value: depositAmount });
        await tx.wait(); // Wait for confirmation

        users.push(user);
        agents.push(agent);

        res.json({
            success: true,
            message: `Agent ${name} created successfully with deposit.`,
            transactionHash: tx.hash
        });

    }

    catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Agent creation failed!", error: error.message });
    }

});

app.get('/agents', (req, res) => {
    const agentList = agents.map(agent => ({
        name: agent.name,
        api: agent.api,
        creator: agent.creator ? agent.creator.address : "Unknown", // Show creator address
        stakers: agent.stakers ? agent.stakers.map(user => user.address) : [] // Show list of staker addresses
    }));

    res.json({ success: true, agents: agentList });
})

app.post('/stake_agent', async(req, res) => {
    const {api, user, amount} = req.body;

    const agent = agents.find(agent => agent.api == api);

    if (!agent) {
        return res.status(404).json({ success: false, message: "Agent not found!" });
    }

    if (!user || typeof user !== "string") {
        return res.status(400).json({ success: false, message: "Invalid user address!" });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid staking amount!" });
    }

    // // Convert amount to Wei
    // const amountInWei = ethers.parseEther(amount.toString());

    // // Send Transaction to Smart Contract
    // const tx = await contract.stakeInAgent(agent.api, { value: amountInWei });

    // // Wait for transaction confirmation
    // await tx.wait();


    const userObj = new User(user);
    agent.addStaker(userObj); 

    res.json({
        success: true,
        message: `User ${user} staked ${amount} ETH for agent ${api}`,
        agent,
    });
})

app.post('/reward_highest_agent', async(req, res) => {
    const { agentId, score, creatorAddress } = req.body;
    
    try {
        // Convert score to the format expected by the contract
        // If score is between 0-1, scale it appropriately for your contract
        const scaledScore = Math.floor(score * 100); // Adjust scaling as needed
        
        // Call the reward function
        const tx = await contract.reward(
            agentId,
            scaledScore,
            creatorAddress,
            { gasLimit: 3000000 } // Add appropriate gas limit
        );
        
        await tx.wait(); // Wait for confirmation
        
        res.json({
            success: true,
            message: `Agent ${agentId} rewarded successfully`,
            transactionHash: tx.hash
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Reward distribution failed!", 
            error: error.message 
        });
    }
});


async function fetchTweets() {
    try {
        const response = await axios.get(
          `https://api.twitter.com/2/users/44196397/tweets`, {
            params: {
              'max_results': 5,
              'tweet.fields': 'text',
              'expansions': 'author_id'
            },
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            }
          }
        );
        
        tweets = (response.data.data.map(tweet => tweet.text));
}
catch(error) {
    console.log(error.message);
}
};


app.post('/send-data', async (req, res) => {
    try {
        const responses = await Promise.all(
            agents.map(async (agent) => {
                try {
                    const response = await axios.post(
                        agent.api, 
                        req.body, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Basic ${agent.key}`
                            }
                        }
                    );
                    return { agent_name: agent.name, agent_address: agent.creator.address, agent_id: agent.id, status: response.status, data: response.data };
                }

                catch (error) {
                    return { 
                        agent_name: agent.name,
                        agent_address: agent.creator.address,
                        agent_id: agent.id, 
                        error: error.response ? error.response.data : error.message 

                    };
                }
            })
        );

        console.log("All responses:", JSON.stringify(responses, null, 2));

        res.status(200).json(responses); 

    }
    catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/get-name-creator', async (req, res) => {
    const { uuids } = req.body; // an array of UUIDs

    if (!Array.isArray(uuids)) {
        return res.status(400).json({ error: "Invalid request format. Expected an array of UUIDs." });
    }

    const result = {}; // Store matched agents

    uuids.forEach(uuid => {
        const agent = agents.find(agent => agent.id === uuid);
        console.log(`Checking UUID ${uuid}: Found agent?`, !!agent);        
        result[uuid] = {
            name: agent.name,
            creator: agent.creator
        };
    
    });

    res.status(200).json(result); // map of UUIDs to names & creators
});



cron.schedule('0 */2 * * *', async () => {
    console.log('Running scheduled data refresh');
    await fetchTweets();
  });
  
  fetchTweets().then(() => {
    console.log('Initial tweets fetched');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
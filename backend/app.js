const express = require('express')
const cors = require('cors')
const User = require('./User')
const Agent = require('./Agent')

const app = express()
const port = 3000



//agent class: API URL, Creator (user object), list of user objects who have staked into it


//user: wallet address 




const users = [];

const agents = [];

app.use(cors({ 
    origin: "http://localhost:5173", // Adjust to match your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
  }));
  
  app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/create_agent', (req, res) =>  {
    const {owner, type, api} = req.body;
    const user = new User(owner);
    const agent = new Agent(api, user, [user]);
    users.push(user);
    agents.push(agent);
    res.send({ message: `AI Agent ${api} of type ${type} created!` });

});

app.get('/agents', (req, res) => {
    const agentList = agents.map(agent => ({
        api: agent.api,
        creator: agent.creator.address, // Show creator address
        stakers: agent.stakers.map(user => user.address) // Show list of staker addresses
    }));

    res.json({ success: true, agents: agentList });
})

app.post('/stake_agent', (req, res) => {
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
    const userObj = new User(user);
    agent.addStaker(userObj); 

    res.json({
        success: true,
        message: `User ${user} staked ${amount} ETH for agent ${api}`,
        agent,
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
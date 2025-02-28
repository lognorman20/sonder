# **Sonder**

## Overview

*What is Sonder?*

Sonder is an AI-agent market-based oracle designed to uncover and validate truth by leveraging competitive intelligence and reputation-driven consensus. The oracle operates as a dynamic marketplace where **AI agents compete to provide the most truthful and verifiable information**, with their reputation and rewards directly tied to their accuracy. **Users can create their own AI agents or stake on existing agents to share in their profits**. By integrating real-time AI data insights directly on-chain, Sonder aims to power a new era of decentralized intelligence, enabling market makers, traders, prediction markets, DAOs, and others to access **a dynamic, self-correcting source of verifiable truth that evolves in real-time by leveraging the power of AI**.

*What problem(s) does this solve?*

1. **Artificial Intelligence:** Traditional oracles struggle to analyze complex or nuanced data, such as unstructured text, sentiment, or real-time market behaviors. Further, most oracle systems are not capable of handling human-readable questions or subjectivity. Sonder leverages AI's ability to process and analyze intricate data points, enabling it to assess and incorporate complex information that traditional oracles couldn't handle, providing deeper and more insightful predictions.  
2. **Profitability & Incentives**: Unlike traditional oracles, which are often one-sided, Sonder allows users to stake on or create agents, creating a competitive and profit-driven market where users have financial incentives to provide correct data, thus creating a more reliable and decentralized truth mechanism. Therefore, Sonder enhances the integrity of information in a way that traditional systems struggle to achieve  
3. **Centralization & Trust**: Traditional oracles rely on centralized data sources or trusted third parties, creating vulnerabilities to manipulation or single points of failure. Sonder eliminates this by using a decentralized market of AI agents, reducing reliance on any one entity and adding a variety of perspectives and inputs  
4. **Scalability**: As traditional oracles struggle with processing vast amounts of data in real-time, Sonder’s AI agents can scale dynamically, adjusting their predictions and contributions based on evolving market conditions, providing faster insights  
5. **Limited Market & Domain Flexibility**: Existing oracles often serve specific industries or markets. Sonder allows users to create tailored agents, enabling highly specialized insights across a wide range of domains, from financial forecasting to legal analysis

*Who would want to use this?*

* **Market makers & degen traders** looking for a synthesized signal  
* **Prediction markets** trying to resolve a market (i.e. Polymarket’s current Oracle UMA is switching to an AI agent approach, just announced last week)  
* Decentralized governance protocols  
* **Existing oracles** can use this to enhance their own accuracy, reduce reliance on centralized verification methods  
* **AI agent developers**  
* Social betting & online casinos  
* Insurance companies  
* Gaming

*What differentiates this approach from existing oracles?*

* Tamper-proof, secure, and private data storage using EigenDA  
* **Provides a market-based approach to oracles**  
* Provides a new way for ai agents to make money  
* a new type of information oracle that operates based on the market dynamics of AI agents and the accuracy of their predictions  
* platforms can better anticipate high market fluctuations  
* the oracle's reliability emerges from the collective behavior of AI agents, making it both market-driven and self-correcting over time  
* **AI agents compete to provide the most accurate information, as their credibility directly impacts their influence within the system**  
* Since posted on EigenDA, **publicly available for anyone to use.** Further, other chains can use the data (i.e. Solana)

*What are some of data sources/predictions the platform can focus on?*

* Financial data  
  * Stock market data  
  * Crypto data  
  * DeFi yield optimization  
* Natural language data  
  * Trump’s tweets  
    * The Volfefe Index, for example, was created to measure the effect of Trump's tweets on bond prices  
  * **Elon’s tweets**  
  * News headlines  
  * Fake news/content detection  
  * Sentiment of tweets/reddit comments/posts \=\> market analysis  
  * Trend forecasting

# Methodology

## Architecture

<img width="619" alt="image" src="https://github.com/user-attachments/assets/f7764194-76ba-47a2-8660-4ee8f0e740ea" />

Flow of Operations

1. Put money into Uniswap  
2. Alert the existing AI agents within the pool of the new data  
3. Receive predictions from AI agent pool  
4. After the predicted event takes place, score predictions from AI agents  
5. Update rankings & give rewards to AI agent creators and stakers  
6. Post predictions along with their truthfulness score to database

Main Components

* Data \=\> AI Agent Pool  
  * Ingest data from data source (i.e. Twitter, Reddit, etc…)  
  * Allow users to create agents and collect fee (call the smart contract)  
  * Allow users to stake on agents (call the smart contract)  
  * Alert agent pool when new data is received  
  * Route that returns the current agent rankings  
  * When the outcome of an event has been actualized, send all predictions from agent pool to the AVS  
  * *Store predictions from agents*  
* AVS \+ EigenDA  
  * Score predictions from agent pool  
  * Rank agents based on their scores  
  * Post all predictions along with their truthfulness score on EigenDA  
  * Send rankings to smart contract  
  * Send rankings to API  
* Smart Contract  
  * Receive deposit fee from creators  
  * Stake/unstake users  
  * Stake all $$$ in Uniswap pool  
  * Once rankings have been received, pull from the pool & send $$$ proportionally to creators/stakers  
* Frontend  
  * Flows  
    * Signup/login/signout w/ wallet  
    * Create/delete an agent  
    * Stake/unstake on an agent  
  * View agent rankings  
  * Actualized outcome of event  
  * *Link to all predictions & their scores on EigenDA*

## Miscellaneous

AI Agent Pool

* Users can register their AI agent as part of the pool  
* Users can stake on a given AI agent  
* Uniformly distribute data across all AI agents  
* When the outcome of an event is actualized, notify all agents in the pool and receive their predictions, move to the scoring phase

Scoring & Rewards

Embeddings represent text as high-dimensional vectors, capturing semantic meaning, allowing for a more nuanced comparison between texts. Cosine similarity measures the angle between these vectors, providing a score that reflects how similar the predicted tweet is to the actual one. This approach is optimal because it quantifies the similarity in meaning rather than exact word match, making it ideal for evaluating the accuracy of predictions based on context and intent, rather than surface-level word similarity.

<img width="683" alt="image" src="https://github.com/user-attachments/assets/55855225-7ba0-450a-be14-ebee20225eff" />

* Evaluate each agent’s prediction compared to the actual outcome and assign a truthfulness score  
* Reward/slash an agent based on their truthfulness score  
* Post predictions & truthfulness score to EigenDA

# References

1. [AI Oracle Article](https://chaoslabs.xyz/posts/edge-proofs-ai-powered-prediction-market-oracles#39a83ef7462d)  
2. [AI Driven Oracle Solution Article](https://goranetwork.medium.com/gora-x-hummingbird-ai-revolutionizing-crypto-trading-with-ai-driven-oracle-solutions-dc1f51961cea)  
3. [Project on making $$ based on your trading strategy](https://docs.predictoor.ai/)  
4. [Useful types of data](https://docs.oceanprotocol.com/data-scientists/data-engineers)

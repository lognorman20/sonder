import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css' 
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { WalletProvider } from "./WalletContext"

import Navbar from "./components/Navbar";
import CreateAIAgent from './CreateAIAgent'
import LandingPage from './LandingPage'
import Stake from "./Stake";



function App() {
  const [count, setCount] = useState(0)

  return (
    <WalletProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<CreateAIAgent />} />
        <Route path="/stake" element={<Stake />} />
        {/* Add additional routes as needed */}
      </Routes>
    </BrowserRouter>
    </WalletProvider>
  );
}

export default App;

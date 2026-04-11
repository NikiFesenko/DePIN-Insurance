import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useBalance } from 'wagmi';
import { foundry } from 'wagmi/chains';
import { parseEther, formatEther } from 'viem';

import Dashboard from './components/Dashboard';
import HowItWorks from './components/HowItWorks';
import NetworkStatus from './components/NetworkStatus';

const contractABI = [
  { type: 'function', name: 'buyInsurance', stateMutability: 'payable', inputs: [{ name: '_deviceId', type: 'string' }] }
];
const vaultAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  // INTRO ANIMATION STATES
  const [showIntro, setShowIntro] = useState(true);
  const [introText, setIntroText] = useState("||||||");

  // APP STATES
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePolicies, setActivePolicies] = useState([]);

  // WEB3 HOOKS
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  // FETCH LIVE VAULT BALANCE (TVL)
  const { data: vaultBalanceData, error: balanceError } = useBalance({
    address: vaultAddress,
    chainId: foundry.id, // 👉 FORCE it to look at Anvil (Chain ID 31337)
    query: {
      refetchInterval: 2000, 
    }
  });

  // If there's a silent error happening behind the scenes, this prints it to your browser console
  if (balanceError) console.error("Balance Fetch Error:", balanceError);
  
// Safely format the raw blockchain data (BigInt) into readable ETH
  const vaultBalance = vaultBalanceData?.value !== undefined
    ? Number(formatEther(vaultBalanceData.value)).toFixed(2) 
    : "0.00";

  // THE FIXED DECRYPTION EFFECT
  useEffect(() => {
    const target = "GARRON";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";
    let currentIdx = 0;
    let scrambles = 0;
    const maxScrambles = 6;

    const interval = setInterval(() => {
      if (currentIdx >= target.length) {
        clearInterval(interval);
        setIntroText(target);
        setTimeout(() => setShowIntro(false), 1000);
        return;
      }

      setIntroText(() => {
        const arr = new Array(target.length).fill('|');

        // Keep solved letters
        for (let i = 0; i < currentIdx; i++) {
          arr[i] = target[i];
        }

        // Scramble current letter
        arr[currentIdx] = chars[Math.floor(Math.random() * chars.length)];

        scrambles++;
        if (scrambles >= maxScrambles) {
          currentIdx++;
          scrambles = 0;
        }

        return arr.join("");
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // THEME TOGGLE EFFECT
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // SMART CONTRACT TRANSACTION
  const handleBuyPolicy = (deviceName, premiumAmount, deviceClassLabel, maxPayout) => {
    writeContract({
      address: vaultAddress,
      abi: contractABI,
      functionName: 'buyInsurance',
      args: [deviceName],
      value: parseEther(premiumAmount.toString()),
    }, {
      onSuccess: () => {
        setActivePolicies(prev => [...prev, {
          name: deviceName,
          class: deviceClassLabel,
          premium: premiumAmount,
          payout: maxPayout,
          id: Math.random().toString(36).substr(2, 9)
        }]);
      }
    });
  };

  // ANIMATION VARIANTS
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <>
      {/* THE CINEMATIC INTRO SCREEN */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f3f5f7] dark:bg-slate-950 overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(#39FF14 1px, transparent 1px), linear-gradient(90deg, #39FF14 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <h1 
              className="font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-[0.2em] relative z-10"
              style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }} 
            >
              {introText}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE MAIN APPLICATION */}
      <div className="min-h-screen bg-[#f3f5f7] dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
        
        <header className="w-full border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">G</div>
            <span className="font-extrabold text-xl tracking-tight">GARRON</span>
          </div>

          <nav className="hidden md:flex gap-8 font-medium text-sm">
            {['dashboard', 'how it works', 'network status'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 capitalize transition duration-200 ${
                  activeTab === tab 
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition duration-200 text-lg">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <ConnectButton showBalance={false} chainStatus="none" />
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-12 md:mt-4">
             <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
               DePIN Insurance, <span className="text-indigo-600 dark:text-indigo-400">Automated.</span>
             </h1>
             <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">
               Secure your hardware node uptime with trustless, blockchain-based coverage.
             </p>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <Dashboard 
                  tabVariants={tabVariants} 
                  isConnected={isConnected} 
                  isPending={isPending} 
                  activePolicies={activePolicies}
                  handleBuyPolicy={handleBuyPolicy} 
                />
              )}
              {activeTab === 'how it works' && <HowItWorks tabVariants={tabVariants} />}
              {activeTab === 'network status' && (
                <NetworkStatus 
                  tabVariants={tabVariants} 
                  activePoliciesCount={activePolicies.length} 
                  vaultBalance={vaultBalance} 
                />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
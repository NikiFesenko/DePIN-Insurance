import { motion } from 'framer-motion';
import { useWriteContract, useAccount } from 'wagmi';
import { parseEther } from 'viem';

// Ensure this matches your freshly deployed vault address!
const vaultAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  { type: 'function', name: 'supplyLiquidity', stateMutability: 'payable', inputs: [] }
];

export default function NetworkStatus({ tabVariants, activePoliciesCount, vaultBalance }) {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  // Function to inject 10 ETH into the vault
  const handleAddLiquidity = () => {
    writeContract({
      address: vaultAddress,
      abi: contractABI,
      functionName: 'supplyLiquidity',
      value: parseEther('10'), // Injects 10 ETH per click
    });
  };

  return (
    <motion.div key="network-status" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
      <div className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg text-gray-500 dark:text-slate-400 font-medium mb-1">Oracle Status</h2>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 relative"></span>
            <span className="text-2xl font-bold">Online & Syncing</span>
          </div>
        </div>
        
        {/* NEW: Liquidity Injection Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleAddLiquidity}
            disabled={!isConnected || isPending}
            className={`px-6 py-3 rounded-xl font-bold transition-all text-sm
              ${!isConnected ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed' : 
                isPending ? 'bg-indigo-400 text-white cursor-wait' : 
                'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/30'}`}
          >
            {isPending ? 'Confirming...' : '+ Supply 10 ETH'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg text-gray-500 dark:text-slate-400 font-medium mb-2">Vault Liquidity (TVL)</h2>
          <span className="text-4xl font-black">{vaultBalance} <span className="text-2xl text-gray-400">ETH</span></span>
        </div>
        
        <div className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg text-gray-500 dark:text-slate-400 font-medium mb-2">Active Contracts</h2>
          <span className="text-4xl font-black">{activePoliciesCount}</span>
        </div>
      </div>
    </motion.div>
  );
}
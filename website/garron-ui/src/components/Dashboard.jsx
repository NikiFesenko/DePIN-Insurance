import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard({ tabVariants, isConnected, isPending, activePolicies, handleBuyPolicy }) {
  // Classification Tiers
  const deviceClasses = [
    { id: 'tier1', label: 'Tier 1: Micro Node', premium: 0.02, payout: 0.5 },
    { id: 'tier2', label: 'Tier 2: Standard Node', premium: 0.05, payout: 1.0 },
    { id: 'tier3', label: 'Tier 3: Enterprise Node', premium: 0.15, payout: 3.0 },
  ];

  // Form State
  const [deviceName, setDeviceName] = useState('');
  const [selectedClass, setSelectedClass] = useState(deviceClasses[1]); // Defaults to Standard

  const submitPolicy = () => {
    if (!deviceName.trim()) return alert("Please enter a device name.");
    handleBuyPolicy(deviceName, selectedClass.premium, selectedClass.label, selectedClass.payout);
    // Clear the name field after submission so they can easily buy another
    setDeviceName(''); 
  };

  return (
    <motion.div key="dashboard" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      
      {/* 1. MINT COVERAGE FORM */}
      <div className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Mint Coverage</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Select your hardware classification tier to calculate your monthly premium and max payout.
          </p>
          
          <div className="space-y-4 mb-6">
            {/* Device Name Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Device Name / ID</label>
              <input 
                type="text" 
                placeholder="e.g. my-helium-miner-01"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Device Classification Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hardware Classification</label>
              <select 
                value={selectedClass.id}
                onChange={(e) => setSelectedClass(deviceClasses.find(c => c.id === e.target.value))}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {deviceClasses.map(tier => (
                  <option key={tier.id} value={tier.id}>
                    {tier.label} — {tier.premium} ETH / mo
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Dynamic Button */}
        <button 
          onClick={submitPolicy}
          disabled={!isConnected || isPending || !deviceName.trim()}
          className={`w-full py-4 rounded-xl font-bold transition-all duration-200 text-lg shadow-sm
            ${!isConnected || !deviceName.trim() ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed' : 
              isPending ? 'bg-indigo-400 text-white cursor-wait' : 
              'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50'}`}
        >
          {!isConnected ? 'Connect Wallet' : 
            isPending ? 'Confirming in Wallet...' : 
            !deviceName.trim() ? 'Enter Device Name' :
            `Supply ${selectedClass.premium} ETH`}
        </button>
      </div>

      {/* 2. PORTFOLIO CARDS */}
      <div className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm overflow-y-auto max-h-[500px]">
        <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
          Your Positions
          <span className="text-sm font-medium bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400">
            {activePolicies.length} Active
          </span>
        </h2>
        
        {activePolicies.length > 0 ? (
          <div className="space-y-4">
            {/* Map through the array and render a card for EVERY policy */}
            {activePolicies.map((policy) => (
              <div key={policy.id} className="border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-green-200 dark:border-green-900/30 pb-3">
                  <div>
                    <span className="font-bold text-green-800 dark:text-green-400 block">{policy.name}</span>
                    <span className="text-xs text-green-600 dark:text-green-500">{policy.class}</span>
                  </div>
                  <span className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-200/50 dark:bg-green-900/50 px-2 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Premium: {policy.premium} ETH</span>
                  <span className="font-bold text-green-700 dark:text-green-400">Payout: {policy.payout} ETH</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm">
            No active policies found.
          </div>
        )}
      </div>
    </motion.div>
  );
}
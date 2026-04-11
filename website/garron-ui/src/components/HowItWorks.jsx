import { motion } from 'framer-motion';

export default function HowItWorks({ tabVariants }) {
  const steps = [
    { step: "01", title: "Mint Policy", text: "Supply the premium to the smart contract vault to activate your coverage." },
    { step: "02", title: "Oracle Monitoring", text: "Our decentralized Rust oracle pings your hardware device every 5 seconds." },
    { step: "03", title: "Automated Payout", text: "If an outage is detected, the oracle triggers the vault to release funds instantly." }
  ];

  return (
    <motion.div key="how-it-works" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {steps.map((item, idx) => (
        <div key={idx} className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-300">
          <div className="text-6xl font-black text-gray-100 dark:text-slate-800/50 absolute -top-4 -right-4 transition-transform group-hover:scale-110">{item.step}</div>
          <h3 className="text-xl font-bold mb-4 relative z-10 mt-8">{item.title}</h3>
          <p className="text-gray-500 dark:text-slate-400 leading-relaxed relative z-10">{item.text}</p>
        </div>
      ))}
    </motion.div>
  );
}
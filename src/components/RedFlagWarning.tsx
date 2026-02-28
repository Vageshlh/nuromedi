import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const RedFlagWarning: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-8"
    >
      <div className="absolute inset-0 bg-red-600/20 backdrop-blur-sm animate-pulse" />
      <div className="glass bg-red-950/80 border-red-500 p-8 rounded-3xl max-w-md text-center pointer-events-auto shadow-[0_0_50px_rgba(220,38,38,0.5)]">
        <ShieldAlert size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-tighter">Emergency Detected</h2>
        <p className="text-red-200 mb-6 leading-relaxed">
          Our AI has detected critical red flags in your symptoms. Please seek immediate medical attention at the nearest emergency room.
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.open('tel:911')}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            CALL EMERGENCY SERVICES (911)
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2 text-white/40 hover:text-white/60 text-xs uppercase tracking-widest"
          >
            Dismiss (I am safe)
          </button>
        </div>
      </div>
    </motion.div>
  );
};

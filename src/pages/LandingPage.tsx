import React from 'react';
import { motion } from 'motion/react';
import { NeonButton } from '../components/NeonButton';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Particles Simulation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: Math.random() * 1000 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              y: [Math.random() * 1000, Math.random() * 1000 - 500]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-neon-blue/30 text-neon-blue text-sm font-mono">
          <Activity size={16} className="animate-pulse" />
          SYSTEM STATUS: OPTIMAL
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tighter">
          NEURO<span className="text-neon-blue">MED</span> AI
        </h1>
        
        <p className="text-xl md:text-2xl text-white/60 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
          The next generation of <span className="text-white">AI-Powered Smart Health Intelligence</span>. 
          Instant diagnosis, precision analysis, and futuristic care.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <NeonButton onClick={onStart} className="text-lg px-12 py-4">
            START DIAGNOSIS
          </NeonButton>
          <div className="flex gap-8 mt-8 md:mt-0">
            <StatItem icon={<ShieldCheck className="text-neon-purple" />} label="Accuracy" value="99.8%" />
            <StatItem icon={<Zap className="text-neon-blue" />} label="Latency" value="14ms" />
          </div>
        </div>
      </motion.div>

      {/* Futuristic Brain Animation Placeholder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
    </div>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col items-center">
    <div className="mb-1">{icon}</div>
    <div className="text-xs font-mono text-white/40 uppercase tracking-widest">{label}</div>
    <div className="text-xl font-display font-bold">{value}</div>
  </div>
);

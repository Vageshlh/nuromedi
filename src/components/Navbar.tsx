import React from 'react';
import { motion } from 'motion/react';
import { Activity, LayoutDashboard, ShieldAlert, Home } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'diagnosis', label: 'Diagnosis', icon: Activity },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass px-6 py-3 rounded-full flex items-center gap-8 border-white/20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative group flex flex-col items-center"
          >
            <item.icon className={cn(
              "w-6 h-6 transition-colors duration-300",
              activeTab === item.id ? "text-neon-blue" : "text-white/50 group-hover:text-white"
            )} />
            {activeTab === item.id && (
              <motion.div
                layoutId="nav-active"
                className="absolute -bottom-2 w-1 h-1 bg-neon-blue rounded-full shadow-[0_0_10px_#00f0ff]"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

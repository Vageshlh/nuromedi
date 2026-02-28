import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'purple' | 'cyan';
  glow?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  className, 
  variant = 'blue', 
  glow = true,
  onClick,
  disabled,
  type = 'button',
  ...props 
}) => {
  const variants = {
    blue: "bg-neon-blue/20 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black",
    purple: "bg-neon-purple/20 border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white",
    cyan: "bg-cyan-400/20 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        "px-6 py-3 rounded-xl border font-display font-semibold transition-all duration-300",
        variants[variant],
        glow && `shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]`,
        className
      )}
    >
      {children}
    </motion.button>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { BrainCircuit, CheckCircle, Activity, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DiagnosisResult } from '../utils/validator';
import { cn } from '../lib/utils';

export const AdvancedDiagnosisCard = ({ data }: { data: DiagnosisResult }) => {
  const urgencyStyles = {
    Routine: "text-green-400 border-green-400/20 bg-green-400/5",
    Moderate: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
    Urgent: "text-orange-400 border-orange-400/20 bg-orange-400/5",
    Emergency: "text-red-400 border-red-500 bg-red-500/10 animate-pulse"
  };

  if (!data || !data.probableConditions) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <GlassCard className="border-neon-blue/20 bg-neon-blue/[0.02] p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl font-display font-bold tracking-tighter">Clinical Report</h3>
              <div className={cn(
                "px-3 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest",
                urgencyStyles[data.urgencyLevel] || urgencyStyles.Routine
              )}>
                {data.urgencyLevel}
              </div>
            </div>
            <p className="text-xs text-white/40 font-mono">TIMESTAMP: {new Date().toISOString()}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">AI Confidence</div>
              <div className="text-2xl font-display font-bold text-neon-blue">{Math.round(data.confidenceScore * 100)}%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* Probable Conditions */}
            <div>
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <BrainCircuit size={14} className="text-neon-blue" />
                Differential Diagnosis
              </h4>
              <div className="space-y-4">
                {data.probableConditions.map((d, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon-blue/30 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-white">{d.condition}</span>
                      <span className="text-xs font-mono text-neon-blue">{Math.round(d.probability * 100)}%</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{d.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags */}
            {data.redFlags.length > 0 && (
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                <h4 className="text-xs font-bold mb-4 flex items-center gap-2 text-red-400">
                  <ShieldAlert size={16} />
                  Red Flags Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.redFlags.map((flag, i) => (
                    <span key={i} className="text-[10px] text-red-200/70">• {flag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Actions */}
            <div className="p-6 rounded-2xl bg-neon-blue/5 border border-neon-blue/10">
              <h4 className="text-xs font-bold mb-4 flex items-center gap-2 text-neon-blue">
                <CheckCircle size={16} />
                Recommended Action
              </h4>
              <p className="text-sm text-white/80 leading-relaxed">{data.recommendedAction}</p>
            </div>

            {/* Summary */}
            <div className={cn(
              "p-6 rounded-2xl border bg-white/[0.03] border-white/5"
            )}>
              <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
                <Info size={16} className="text-neon-blue" />
                Clinical Summary
              </h4>
              <p className="text-xs text-white/60 leading-relaxed italic">
                Extracted Symptoms: {data.extractedSymptoms.join(", ")}
              </p>
            </div>

            <div className="flex gap-4">
              <NeonButton className="flex-1 py-3 text-xs">
                EXPORT CLINICAL PDF
              </NeonButton>
              <NeonButton variant="purple" className="flex-1 py-3 text-xs">
                CONSULT SPECIALIST
              </NeonButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Activity, Clock, Calendar, ChevronRight, User as UserIcon, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RiskRadar } from '../components/RiskRadar';

const mockVitalityData = [
  { name: '01', value: 72 },
  { name: '02', value: 68 },
  { name: '03', value: 75 },
  { name: '04', value: 70 },
  { name: '05', value: 82 },
  { name: '06', value: 78 },
  { name: '07', value: 85 },
];

export const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const email = 'demo@neuromed.ai';
    Promise.all([
      fetch(`/api/history?email=${email}`).then(res => res.ok ? res.json() : []),
      fetch(`/api/user/profile?email=${email}`).then(res => res.ok ? res.json() : null)
    ]).then(([historyData, profileData]) => {
      setHistory(Array.isArray(historyData) ? historyData : []);
      setProfile(profileData);
    }).catch(err => {
      console.error('Dashboard Fetch Error:', err);
      setHistory([]);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-40 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Profile & Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="text-center border-white/5">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-[2px]">
                <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                  <UserIcon size={40} className="text-neon-blue" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-1">{profile?.name || 'Patient'}</h2>
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em] mb-8">Clinical ID: NM-88291</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-[9px] text-white/30 uppercase mb-1">Age</div>
                <div className="text-lg font-display font-bold text-neon-blue">{profile?.age || '--'}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-[9px] text-white/30 uppercase mb-1">Gender</div>
                <div className="text-lg font-display font-bold text-neon-purple">{profile?.gender?.charAt(0) || '--'}</div>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Primary Conditions</div>
                <div className="text-xs text-white/70 leading-relaxed">
                  {profile?.existing_conditions || 'None reported'}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
              <Calendar size={14} className="text-neon-blue" />
              Clinical Timeline
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Neurology Follow-up', date: 'Mar 12', status: 'Confirmed' },
                { title: 'MRI Scan (Brain)', date: 'Mar 18', status: 'Pending' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/10">
                    <span className="text-[10px] font-bold text-neon-blue">{item.date.split(' ')[1]}</span>
                    <span className="text-[8px] text-white/30 uppercase">{item.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white group-hover:text-neon-blue transition-colors">{item.title}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-widest">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Main Dashboard Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Vitality Index Chart */}
          <GlassCard className="border-white/5 p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <TrendingUp size={20} className="text-neon-blue" />
                  Health Vitality Index
                </h3>
                <p className="text-xs text-white/30 mt-1">Systemic wellness tracking over the last 7 cycles</p>
              </div>
              <div className="flex gap-2">
                {['7D', '30D', '90D'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${t === '7D' ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'bg-white/5 text-white/40 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockVitalityData}>
                  <defs>
                    <linearGradient id="vitalityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid #ffffff10', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#00f0ff', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff40', fontSize: '10px', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#vitalityGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Diagnosis History with Risk Radars */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                <Clock size={20} className="text-neon-purple" />
                Clinical History
              </h3>
              <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Total Records: {history.length}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item, i) => {
                const diffDiag = JSON.parse(item.differential_diagnosis || '[]');
                const riskProfile = JSON.parse(item.risk_profile || '{}');
                const urgencyStyles = {
                  Routine: "text-green-400 border-green-400/20 bg-green-400/5",
                  Moderate: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
                  Urgent: "text-orange-400 border-orange-400/20 bg-orange-400/5",
                  Emergency: "text-red-400 border-red-400/20 bg-red-400/5"
                };

                return (
                  <GlassCard key={i} className="p-6 border-white/5 hover:border-neon-blue/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest border",
                        urgencyStyles[item.urgency as keyof typeof urgencyStyles]
                      )}>
                        {item.urgency}
                      </div>
                      <span className="text-[10px] text-white/20 font-mono">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-6 mb-6">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">
                          {diffDiag[0]?.name || 'Unknown Condition'}
                        </h4>
                        <p className="text-[10px] text-white/40 italic line-clamp-2">"{item.symptoms}"</p>
                      </div>
                      <div className="w-24 h-24 shrink-0">
                        <RiskRadar data={riskProfile} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-neon-blue" />
                        <span className="text-[10px] font-mono text-white/60">CONFIDENCE: {item.confidence_score}%</span>
                      </div>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-neon-blue/10 text-white/20 hover:text-neon-blue transition-all">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
              
              {history.length === 0 && (
                <div className="col-span-2 py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-dashed border-white/20">
                    <Activity size={24} className="text-white/20" />
                  </div>
                  <p className="text-sm text-white/20 font-mono uppercase tracking-widest">No clinical records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../lib/utils';

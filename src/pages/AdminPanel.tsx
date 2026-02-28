import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ShieldAlert, Users, Activity, Database, Terminal, Search, TrendingUp, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area } from 'recharts';

export const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => {
        console.error(err);
        setStats({
          totalDiagnosis: 0,
          urgencyStats: [],
          confidenceTrend: [],
          recentLogs: []
        });
      });
  }, []);

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-mono text-neon-blue tracking-[0.3em] animate-pulse">DECRYPTING ADMIN CORE...</div>
      </div>
    </div>
  );

  const urgencyData = stats.urgencyStats.map((s: any) => ({
    name: s.urgency,
    value: s.count
  }));

  const COLORS = ['#10b981', '#facc15', '#f97316', '#ef4444'];

  return (
    <div className="min-h-screen pt-24 pb-40 px-4 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple shadow-[0_0_20px_rgba(122,0,255,0.2)]">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tighter">Command Center</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">System v2.0.4-PRO</span>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-green-500/60 uppercase tracking-widest">Network Stable</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-end">
            <span className="text-[9px] text-white/30 uppercase tracking-widest">API Latency</span>
            <span className="text-xl font-display font-bold text-neon-blue">14ms</span>
          </div>
          <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-end">
            <span className="text-[9px] text-white/30 uppercase tracking-widest">Neural Load</span>
            <span className="text-xl font-display font-bold text-neon-purple">28%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Users />} label="Active Patients" value="1,429" delta="+8.4%" />
        <StatCard icon={<Activity />} label="Total Analyses" value={stats.totalDiagnosis} delta="+12.1%" />
        <StatCard icon={<TrendingUp />} label="Avg Confidence" value={`${Math.round(stats.confidenceTrend[0]?.avg_confidence || 0)}%`} delta="+2.3%" />
        <StatCard icon={<AlertTriangle />} label="Red Flags" value="14" delta="-5.2%" isNegative />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Confidence Trend */}
        <GlassCard className="lg:col-span-2 p-8 border-white/5">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-display font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-neon-blue" />
              AI Confidence Trends
            </h3>
            <div className="text-[10px] text-white/30 font-mono">LAST 30 CYCLES</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.confidenceTrend}>
                <defs>
                  <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Area type="monotone" dataKey="avg_confidence" stroke="#00f0ff" strokeWidth={3} fill="url(#confGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Urgency Donut */}
        <GlassCard className="lg:col-span-1 p-8 border-white/5">
          <h3 className="text-xl font-display font-bold mb-10 flex items-center gap-2">
            <PieChartIcon size={20} className="text-neon-purple" />
            Triage Distribution
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={urgencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {urgencyData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-2xl font-display font-bold">{stats.totalDiagnosis}</div>
              <div className="text-[8px] text-white/30 uppercase tracking-widest">Total Cases</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {urgencyData.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-white/60 uppercase tracking-widest">{d.name}</span>
                <span className="text-[10px] font-bold ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Audit Logs */}
      <GlassCard className="border-white/5 p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-display font-bold flex items-center gap-2">
            <Terminal size={20} className="text-white/40" />
            Security Audit Trail
          </h3>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Search size={14} className="text-white/30" />
            <input placeholder="Filter logs..." className="bg-transparent border-none outline-none text-xs text-white/60 w-40" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-white/30 uppercase tracking-widest">
                <th className="pb-4 font-medium">Timestamp</th>
                <th className="pb-4 font-medium">User Entity</th>
                <th className="pb-4 font-medium">Action</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono">
              {stats.recentLogs.map((log: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 text-white/40">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="py-4 text-neon-blue">{log.user_email}</td>
                  <td className="py-4 text-white/80">{log.action}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] uppercase">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

const StatCard = ({ icon, label, value, delta, isNegative }: { icon: React.ReactNode, label: string, value: string | number, delta: string, isNegative?: boolean }) => (
  <GlassCard className="p-6 border-white/5">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-white/5 text-white/40 border border-white/10">{icon}</div>
      <div className={cn(
        "text-[10px] font-bold px-2 py-1 rounded-md",
        isNegative ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"
      )}>{delta}</div>
    </div>
    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">{label}</div>
    <div className="text-3xl font-display font-bold text-white tracking-tighter">{value}</div>
  </GlassCard>
);

import { cn } from '../lib/utils';

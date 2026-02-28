import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { User, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface ProfilePageProps {
  onComplete: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState({
    name: '',
    age: 30,
    gender: 'Other',
    existingConditions: '',
    medications: '',
    allergies: '',
  });
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch('/api/user/profile?email=demo@neuromed.ai')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProfile({
            ...data,
            existingConditions: data.existing_conditions || '',
            medications: data.medications || '',
            allergies: data.allergies || '',
          });
        }
      });
  }, []);

  const handleSave = async () => {
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@neuromed.ai',
        ...profile
      })
    });
    onComplete();
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-neon-blue/20 text-neon-blue">
                  <Lock size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">Privacy & Consent</h2>
                  <p className="text-white/40 text-sm">HIPAA-Compliant Data Processing</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-white/60 leading-relaxed mb-8">
                <p>NeuroMed AI v2.0 uses advanced neural networks to assist in clinical decision support. By proceeding, you acknowledge:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>This is a prototype and not a replacement for professional medical advice.</li>
                  <li>Your data is encrypted and used only for diagnostic analysis.</li>
                  <li>In case of emergency, the system will trigger a red-flag alert.</li>
                </ul>
              </div>

              <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors mb-8">
                <input 
                  type="checkbox" 
                  checked={consent} 
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-dark-bg text-neon-blue focus:ring-neon-blue"
                />
                <span className="text-sm">I understand and consent to the data processing terms.</span>
              </label>

              <NeonButton 
                disabled={!consent} 
                onClick={() => setStep(2)}
                className="w-full py-4"
              >
                CONTINUE TO PROFILE
              </NeonButton>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <User size={24} className="text-neon-blue" />
                Patient Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Full Name</label>
                  <input 
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Age</label>
                  <input 
                    type="number"
                    value={profile.age}
                    onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Gender</label>
                  <select 
                    value={profile.gender}
                    onChange={e => setProfile({...profile, gender: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue transition-colors appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Existing Conditions</label>
                  <textarea 
                    value={profile.existingConditions}
                    onChange={e => setProfile({...profile, existingConditions: e.target.value})}
                    placeholder="e.g. Hypertension, Diabetes Type 2"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue transition-colors h-24 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Current Medications</label>
                  <input 
                    value={profile.medications}
                    onChange={e => setProfile({...profile, medications: e.target.value})}
                    placeholder="e.g. Metformin, Lisinopril"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
              </div>

              <NeonButton onClick={handleSave} className="w-full py-4">
                SAVE & START DIAGNOSIS
              </NeonButton>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { AnimatePresence } from 'motion/react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DiagnosisPage } from './pages/DiagnosisPage';
import { Dashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/AdminPanel';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [hasProfile, setHasProfile] = useState(false);
  const [patientProfile, setPatientProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/profile?email=demo@neuromed.ai')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setHasProfile(true);
          setPatientProfile({
            age: data.age,
            gender: data.gender,
            existingConditions: data.existing_conditions?.split(',') || [],
            medications: data.medications?.split(',') || [],
            allergies: data.allergies?.split(',') || [],
          });
        }
      });
  }, []);

  const renderPage = () => {
    if (activeTab === 'diagnosis' && !hasProfile) {
      return <ProfilePage onComplete={() => setHasProfile(true)} />;
    }

    switch (activeTab) {
      case 'landing':
        return <LandingPage onStart={() => setActiveTab('diagnosis')} />;
      case 'diagnosis':
        return <DiagnosisPage profile={patientProfile} />;
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <LandingPage onStart={() => setActiveTab('diagnosis')} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-neon-blue/30 selection:text-neon-blue">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}


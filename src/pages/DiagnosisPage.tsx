import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Send, Bot, User, Loader2, AlertTriangle, CheckCircle, Download, MapPin, ShieldAlert, Info, BrainCircuit, Activity, Mic, Volume2, VolumeX } from 'lucide-react';
import { PatientProfile, DiagnosisResult } from '../utils/validator';
import { cn } from '../lib/utils';
import { RedFlagWarning } from '../components/RedFlagWarning';
import { AdvancedDiagnosisCard } from '../components/AdvancedDiagnosisCard';
import { logger } from '../utils/logger';

interface Message {
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'diagnosis' | 'error';
  data?: DiagnosisResult;
}

export const DiagnosisPage: React.FC<{ profile: PatientProfile }> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "NeuroMed AI v2.0 (Stable) Initialized. Please describe your symptoms in detail." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: userMsg })
      });

      if (!response.ok) throw new Error('Diagnosis request failed');
      
      const result: DiagnosisResult = await response.json();
      
      const responseText = result.urgencyLevel === 'Emergency' 
        ? "CRITICAL ALERT: Emergency state detected. Immediate medical intervention required." 
        : "Clinical analysis complete. Differential diagnosis report generated.";

      setDiagnosisData(result);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: responseText,
        type: result.confidenceScore === 0 ? 'error' : 'diagnosis',
        data: result
      }]);
      
      // Save to DB only if it's a real diagnosis
      if (result.confidenceScore > 0) {
        await fetch('/api/diagnosis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email: "demo@neuromed.ai",
            symptoms: userMsg,
            extracted_entities: { symptoms: result.extractedSymptoms },
            differential_diagnosis: result.probableConditions,
            urgency: result.urgencyLevel,
            confidence_score: Math.round(result.confidenceScore * 100),
            risk_profile: { systemicStress: Math.round(result.confidenceScore * 100) }, // Simplified for new schema
            suggested_actions: { homeCare: [result.recommendedAction] },
            red_flags_detected: result.urgencyLevel === 'Emergency'
          })
        }).catch(err => logger.error('Failed to save diagnosis', err));
      }
      speak(responseText);
    } catch (error) {
      logger.error('Frontend Diagnosis Error', error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Neural pipeline error. Please re-state symptoms for re-analysis.",
        type: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-40 px-4 max-w-5xl mx-auto">
      {diagnosisData?.urgencyLevel === 'Emergency' && <RedFlagWarning />}

      <div className="flex flex-col gap-8">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.role === 'ai' ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple'
                }`}>
                  {msg.role === 'ai' ? <BrainCircuit size={20} /> : <User size={20} />}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <GlassCard className={cn(
                      "p-5 border-white/5",
                      msg.role === 'user' ? "bg-neon-purple/5" : "bg-white/5"
                    )}>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">{msg.content}</p>
                    </GlassCard>
                    {msg.role === 'ai' && (
                      <button 
                        onClick={() => speak(msg.content)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-neon-blue transition-colors"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                  
                  {msg.type === 'diagnosis' && msg.data && (
                    <AdvancedDiagnosisCard data={msg.data} />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-start pl-14">
            <div className="flex gap-3 items-center text-neon-blue/40 font-mono text-[10px] tracking-[0.2em]">
              <div className="flex gap-1">
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-neon-blue rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-neon-blue rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-neon-blue rounded-full" />
              </div>
              CLINICAL REASONING IN PROGRESS...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {!diagnosisData && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
          <div className="glass p-3 rounded-2xl flex items-center gap-3 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <button 
              onClick={startListening}
              className={cn(
                "p-3 rounded-xl transition-all",
                isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-white/5 text-white/40 hover:text-neon-blue"
              )}
            >
              <Mic size={20} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter clinical symptoms..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-white placeholder:text-white/20 text-sm font-sans"
            />
            <NeonButton onClick={handleSend} className="p-3 px-6" glow={false}>
              <Send size={18} />
            </NeonButton>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <ShieldAlert size={12} className="text-neon-blue" />
        <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">Clinical Support Mode v2.0.4</span>
      </div>
    </div>
  );
};

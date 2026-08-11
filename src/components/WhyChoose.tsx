import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, HardDrive, Cpu, ShieldCheck, Activity, Headphones, Globe, Database, Server, Boxes, Bot, Gamepad2, Sparkles, Lock, Cloud } from 'lucide-react';
import { AdminFeature } from '../types';
import { getStoredFeatures } from '../utils/featureSync';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-amber-400" />,
  HardDrive: <HardDrive className="w-6 h-6 text-blue-400" />,
  Cpu: <Cpu className="w-6 h-6 text-purple-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
  Activity: <Activity className="w-6 h-6 text-indigo-400" />,
  Headphones: <Headphones className="w-6 h-6 text-rose-400" />,
  Globe: <Globe className="w-6 h-6 text-cyan-400" />,
  Database: <Database className="w-6 h-6 text-violet-400" />,
  Server: <Server className="w-6 h-6 text-purple-400" />,
  Boxes: <Boxes className="w-6 h-6 text-amber-400" />,
  Bot: <Bot className="w-6 h-6 text-emerald-400" />,
  Gamepad2: <Gamepad2 className="w-6 h-6 text-pink-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-yellow-400" />,
  Lock: <Lock className="w-6 h-6 text-sky-400" />,
  Cloud: <Cloud className="w-6 h-6 text-blue-400" />,
};

export function WhyChoose() {
  const [features, setFeatures] = useState<AdminFeature[]>(getStoredFeatures());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) {
        setFeatures((e as CustomEvent).detail);
      } else {
        setFeatures(getStoredFeatures());
      }
    };
    const handleStorage = () => {
      setFeatures(getStoredFeatures());
    };

    window.addEventListener('astro_features_changed', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('astro_features_changed', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const activeFeatures = features
    .filter(f => f.status === 'active')
    .sort((a, b) => a.order - b.order);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/10">
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-purple-950/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-purple-400 font-bold bg-purple-950/80 border border-purple-500/30 px-4 py-1.5 rounded-full">
            Why Choose AstroCloude
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Built Without Compromise.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            We invest in enterprise-grade hardware and carrier networks so your players and users experience zero lag.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeFeatures.map((feat, index) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-slate-900/60 border border-white/10 hover:border-purple-500/40 rounded-2xl p-6 backdrop-blur-xl transition-all hover:-translate-y-1 group relative overflow-hidden"
            >
              {feat.badge && (
                <span className="absolute top-4 right-4 bg-purple-600/30 border border-purple-500/40 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {feat.badge}
                </span>
              )}

              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform overflow-hidden">
                {feat.customImage ? (
                  <img src={feat.customImage} alt={feat.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  iconMap[feat.icon] || <Zap className="w-6 h-6 text-purple-400" />
                )}
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


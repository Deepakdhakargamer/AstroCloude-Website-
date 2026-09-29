import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Database, Wifi, Shield, Sparkles, ChevronRight, Check, Server, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminHostingPlan, AdminCategory } from '../types';
import { getStoredCategories } from '../utils/categorySync';
import { getStoredPlans } from '../utils/planSync';
import { formatINR } from '../utils/currency';
import { getPlanSpecs } from '../utils/specFormat';

interface PlansProps {
  onRequestPlan: (plan: AdminHostingPlan) => void;
}

export function Plans({ onRequestPlan }: PlansProps) {
  const [categories, setCategories] = useState<AdminCategory[]>(getStoredCategories());
  const [plans, setPlans] = useState<AdminHostingPlan[]>(getStoredPlans());
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const handleCategoryUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) setCategories((e as CustomEvent).detail);
      else setCategories(getStoredCategories());
    };
    
    const handlePlanUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) setPlans((e as CustomEvent).detail);
      else setPlans(getStoredPlans());
    };

    const handleStorage = () => {
      setCategories(getStoredCategories());
      setPlans(getStoredPlans());
    };

    window.addEventListener('astro_categories_changed', handleCategoryUpdate);
    window.addEventListener('astro_plans_changed', handlePlanUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('astro_categories_changed', handleCategoryUpdate);
      window.removeEventListener('astro_plans_changed', handlePlanUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const activeCategories = categories
    .filter(c => c.status === 'active')
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!activeTab && activeCategories.length > 0) {
      setActiveTab(activeCategories[0].id);
    }
  }, [activeCategories, activeTab]);

  const tabs = activeCategories.map(c => ({ id: c.id, label: c.name }));

  const planBelongsToCategory = (p: AdminHostingPlan, cat: AdminCategory) => {
    return p.categoryId === cat.id;
  };

  const filteredPlans = plans.filter(p => {
        if (p.status !== 'active') return false;
        return p.categoryId === activeTab;
      }).sort((a, b) => a.order - b.order);

  return (
    <section id="plans" className="py-24 bg-slate-950/95 relative overflow-hidden border-t border-white/10">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs uppercase tracking-widest text-purple-400 font-bold bg-purple-950/80 border border-purple-500/30 px-4 py-1.5 rounded-full">
            Transparent Configuration Matrix
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Select Your Power Level.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Enterprise hardware specifications configured for zero latency and maximum stability. Request instant deployment with zero upfront fees.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan, index) => {
            const cat = activeCategories.find(c => c.id === plan.categoryId);
            const isFeatured = plan.featured;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative bg-slate-900/80 border rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl flex flex-col group ${
                  isFeatured
                    ? 'border-purple-500/60 shadow-purple-950/60'
                    : 'border-white/10 hover:border-purple-500/40'
                }`}
              >
                {/* Background Image / Banner */}
                {plan.bannerImage && (
                  <div className="absolute inset-0 z-0">
                    <img src={plan.bannerImage} alt="" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/90 to-slate-950"></div>
                  </div>
                )}
                
                {/* Plan Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] uppercase tracking-widest font-extrabold px-3.5 py-1 rounded-full shadow-lg z-20">
                    {plan.badge}
                  </div>
                )}
                
                <div className="p-7 flex flex-col flex-1 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    {plan.logo ? (
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 p-2 flex items-center justify-center">
                        <img src={plan.logo} alt={plan.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 border border-purple-500/30 px-3 py-1 rounded-lg">
                        {cat?.name?.toUpperCase() || 'HOSTING'}
                      </span>
                    )}
                    
                    <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      {formatINR(plan.price)}/mo
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {plan.name}
                  </h3>
                  
                  {plan.description && (
                    <p className="text-sm text-slate-400 mb-6 line-clamp-2">{plan.description}</p>
                  )}
                  
                  {plan.fullDescription && (
                    <div className="text-xs text-slate-300 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                      {plan.fullDescription}
                    </div>
                  )}

                  {(() => {
                    const specs = getPlanSpecs(plan);
                    return (
                      <>
                        {/* Highlighted Hardware Specs: CPU, RAM, Disk */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 mb-6 text-center">
                          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/20 border border-purple-500/20">
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-purple-400 mb-0.5">
                              <Cpu className="w-3.5 h-3.5" />
                              <span>CPU</span>
                            </div>
                            <span className="text-xs font-black text-white truncate max-w-full" title={specs.cpu}>
                              {specs.shortCpu}
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-950/20 border border-blue-500/20">
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-400 mb-0.5">
                              <Database className="w-3.5 h-3.5" />
                              <span>RAM</span>
                            </div>
                            <span className="text-xs font-black text-white truncate max-w-full" title={specs.ram}>
                              {specs.shortRam}
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 mb-0.5">
                              <HardDrive className="w-3.5 h-3.5" />
                              <span>Disk</span>
                            </div>
                            <span className="text-xs font-black text-white truncate max-w-full" title={specs.disk}>
                              {specs.shortDisk}
                            </span>
                          </div>
                        </div>

                        {/* Detailed Specs list */}
                        <div className="space-y-3 mb-8 text-xs flex-1">
                          <div className="flex items-center gap-3 text-slate-200 border-b border-white/5 pb-2.5">
                            <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-slate-400 w-24 shrink-0 font-medium">CPU:</span>
                            <span className="font-semibold text-white truncate">{specs.cpu}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-200 border-b border-white/5 pb-2.5">
                            <Database className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="text-slate-400 w-24 shrink-0 font-medium">RAM:</span>
                            <span className="font-semibold text-white truncate">{specs.ram}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-200 border-b border-white/5 pb-2.5">
                            <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-slate-400 w-24 shrink-0 font-medium">Disk / Storage:</span>
                            <span className="font-semibold text-white truncate">{specs.disk}</span>
                          </div>
                          {specs.bandwidth && specs.bandwidth !== 'N/A' && (
                            <div className="flex items-center gap-3 text-slate-200 border-b border-white/5 pb-2.5">
                              <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span className="text-slate-400 w-24 shrink-0 font-medium">Bandwidth:</span>
                              <span className="font-semibold text-white truncate">{specs.bandwidth}</span>
                            </div>
                          )}
                          {specs.network && (
                            <div className="flex items-center gap-3 text-slate-200 border-b border-white/5 pb-2.5">
                              <Wifi className="w-4 h-4 text-indigo-400 shrink-0" />
                              <span className="text-slate-400 w-24 shrink-0 font-medium">Network:</span>
                              <span className="font-semibold text-white truncate">{specs.network}</span>
                            </div>
                          )}
                          {specs.ddos && (
                            <div className="flex items-center gap-3 text-slate-200 border-b border-white/5 pb-2.5">
                              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="text-slate-400 w-24 shrink-0 font-medium">DDoS Defense:</span>
                              <span className="font-semibold text-white truncate">{specs.ddos}</span>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}

                  {/* Feature list */}
                  {plan.features && plan.features.length > 0 && (
                    <div className="mb-6 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2 font-semibold">Included Features:</span>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available Locations tags */}
                  {plan.locations && plan.locations.length > 0 && (
                    <div className="mb-6">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2 font-semibold">Available Locations:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.locations.map((loc, lIdx) => (
                          <span key={lIdx} className="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-md">
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => onRequestPlan(plan)}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                        isFeatured 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-600/30' 
                          : 'bg-white/10 hover:bg-white/20 border border-white/5'
                      }`}
                    >
                      {isFeatured ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <span>{plan.buttonText || 'Buy Now'}</span>
                    </button>
                    
                    {/* Footer text / Image */}
                    {(plan.footerText || plan.footerImage) && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2">
                        {plan.footerImage && (
                          <img src={plan.footerImage} alt="" className="h-4 opacity-50" />
                        )}
                        {plan.footerText && (
                          <span className="text-[10px] text-slate-500">{plan.footerText}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Server className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Plans Available</h3>
            <p className="text-slate-400 text-sm">We couldn't find any hosting plans for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Cpu, Server, HardDrive, Globe, CheckCircle2, ShoppingCart, Zap, Box } from 'lucide-react';
import { AdminCategory, AdminHostingPlan } from '../types';
import { getStoredCategories } from '../utils/categorySync';
import { getStoredPlans } from '../utils/planSync';
import { formatINR } from '../utils/currency';

interface CategoryPlansProps {
  categoryId: string;
  onBack: () => void;
  onRequestPlan: (plan: AdminHostingPlan) => void;
}

export function CategoryPlans({ categoryId, onBack, onRequestPlan }: CategoryPlansProps) {
  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [plans, setPlans] = useState<AdminHostingPlan[]>([]);

  useEffect(() => {
    const categories = getStoredCategories();
    const found = categories.find((c) => c.id === categoryId);
    setCategory(found || null);

    const allPlans = getStoredPlans();
    const catPlans = allPlans.filter((p) => p.categoryId === categoryId && p.status === 'active').sort((a, b) => a.order - b.order);
    setPlans(catPlans);
  }, [categoryId]);

  useEffect(() => {
    const handleUpdate = () => {
      const categories = getStoredCategories();
      const found = categories.find((c) => c.id === categoryId);
      setCategory(found || null);

      const allPlans = getStoredPlans();
      const catPlans = allPlans.filter((p) => p.categoryId === categoryId && p.status === 'active').sort((a, b) => a.order - b.order);
      setPlans(catPlans);
    };
    window.addEventListener('astro_plans_changed', handleUpdate);
    window.addEventListener('astro_categories_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('astro_plans_changed', handleUpdate);
      window.removeEventListener('astro_categories_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4 bg-slate-950">
        <h2 className="text-2xl font-bold text-white mb-4">Category Not Found</h2>
        <button onClick={onBack} className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

        {/* Category Header */}
        <div className="mb-16 relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl">
          {category.bannerImage && (
            <div className="absolute inset-0 h-full w-full">
              <img src={category.bannerImage} alt={category.name} className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent" />
            </div>
          )}
          <div className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
            {category.logo ? (
              <img src={category.logo} alt={category.name} className="w-24 h-24 rounded-2xl shadow-2xl object-cover border border-white/10" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-2xl">
                <Box className="w-12 h-12 text-purple-500" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">{category.name}</h1>
                {category.badge && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
                    {category.badge}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {category.longDescription || category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="space-y-8">
          <div className="text-center sm:text-left mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-3">
              <Zap className="w-6 h-6 text-purple-500" /> Available Plans
            </h2>
          </div>

          {plans.length === 0 ? (
            <div className="py-20 text-center bg-slate-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
              <Server className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No plans available in this category</h3>
              <p className="text-slate-400">Please check back later or contact support.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col bg-slate-900/60 border ${plan.featured || plan.badge === 'Popular' ? 'border-purple-500/50 shadow-lg shadow-purple-900/20' : 'border-white/10'} rounded-3xl overflow-hidden backdrop-blur-xl group hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300`}
                >
                  {plan.badge && (
                    <div className="absolute top-0 inset-x-0">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] uppercase tracking-widest font-extrabold py-1.5 text-center shadow-lg">
                        {plan.badge}
                      </div>
                    </div>
                  )}
                  
                  <div className={`p-6 sm:p-8 flex-1 flex flex-col ${plan.badge ? 'pt-10' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{plan.description}</p>
                      </div>
                      {plan.logo && (
                        <img src={plan.logo} alt={plan.name} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                      )}
                    </div>

                    <div className="mb-6 pb-6 border-b border-white/10 flex-1">
                      <div className="flex items-end gap-1 mb-4">
                        <span className="text-4xl font-black text-white">{formatINR(plan.price)}</span>
                        <span className="text-slate-400 text-sm mb-1.5">/mo</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {plan.cpu && (
                          <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                            <Cpu className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-semibold text-slate-300">{plan.cpu}</span>
                          </div>
                        )}
                        {plan.ram && (
                          <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                            <Server className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-semibold text-slate-300">{plan.ram}</span>
                          </div>
                        )}
                        {plan.storage && (
                          <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                            <HardDrive className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-semibold text-slate-300">{plan.storage}</span>
                          </div>
                        )}
                        {plan.bandwidth && (
                          <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                            <Globe className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-semibold text-slate-300">{plan.bandwidth}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                      <ul className="space-y-3">
                        {plan.features?.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => onRequestPlan(plan)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {plan.buttonText || 'Buy Now'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

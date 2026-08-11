import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Boxes, Cpu, Bot, Server, Globe, Gamepad2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICES_DATA } from '../data/mockData';
import { HostingService, AdminCategory } from '../types';
import { getStoredCategories } from '../utils/categorySync';

interface ServicesProps {
  onSelectService: (service: HostingService) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Boxes: <Boxes className="w-6 h-6 text-purple-400" />,
  Cpu: <Cpu className="w-6 h-6 text-blue-400" />,
  Bot: <Bot className="w-6 h-6 text-indigo-400" />,
  Server: <Server className="w-6 h-6 text-emerald-400" />,
  Globe: <Globe className="w-6 h-6 text-amber-400" />,
  Gamepad2: <Gamepad2 className="w-6 h-6 text-rose-400" />,
};

export function Services({ onSelectService }: ServicesProps) {
  const [categories, setCategories] = useState<AdminCategory[]>(getStoredCategories());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) {
        setCategories((e as CustomEvent).detail);
      } else {
        setCategories(getStoredCategories());
      }
    };
    const handleStorage = () => {
      setCategories(getStoredCategories());
    };

    window.addEventListener('astro_categories_changed', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('astro_categories_changed', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const activeCategories = categories
    .filter(c => c.status === 'active')
    .sort((a, b) => a.order - b.order);

  const services = activeCategories.map((cat, idx) => {
    const match = SERVICES_DATA.find(s => s.id === cat.id || s.title.toLowerCase() === cat.name.toLowerCase());
    return {
      id: cat.id,
      title: cat.name,
      category: (match?.category || 'vps') as any,
      icon: cat.icon && iconMap[cat.icon] ? cat.icon : 'Server',
      description: cat.description,
      longDescription: cat.longDescription,
      logo: cat.logo,
      bannerImage: cat.bannerImage,
      badge: cat.badge,
      buttonText: cat.buttonText || 'Buy Now',
      buttonLink: cat.buttonLink || '#plans',
      featured: cat.featured,
      features: (cat.features && cat.features.length > 0) ? cat.features : (match?.features || ['High Performance Node', 'Instant Deployment', 'DDoS Protection', 'Cloud Backups']),
      startingRam: match?.startingRam || '4 GB',
      startingCpu: match?.startingCpu || 'Dedicated Core',
      popular: cat.badge === 'Popular' || cat.featured || match?.popular || idx === 0,
    };
  });

  return (
    <section id="services" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-purple-400 font-bold bg-purple-950/80 border border-purple-500/30 px-4 py-1.5 rounded-full">
            Enterprise Hosting Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Engineered For Absolute Performance.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Choose from our specialized high-availability hosting stacks designed for gamers, developers, and growing enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative bg-slate-900/60 border rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl transition-all flex flex-col justify-between group ${
                service.popular || service.featured
                  ? 'border-purple-500/60 shadow-purple-950/50 bg-gradient-to-b from-purple-950/30 via-slate-900/80 to-slate-900/90'
                  : 'border-white/10 hover:border-purple-500/40'
              }`}
            >
              {service.bannerImage && (
                <div className="h-32 w-full overflow-hidden relative border-b border-white/10">
                  <img 
                    src={service.bannerImage} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
              )}

              {service.badge && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full shadow-lg z-10">
                  {service.badge}
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:border-purple-500/50 transition-all shadow-inner">
                    {service.logo ? (
                      <img src={service.logo} alt={service.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      iconMap[service.icon] || iconMap['Server']
                    )}
                  </div>

                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {service.title}
                </h3>
                {service.description && service.description.trim() !== '' && (
                  <motion.div
                    initial={{ opacity: 0.85, y: 0 }}
                    whileHover={{ opacity: 1, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-purple-500/40 group-hover:bg-purple-950/30 transition-all shadow-sm"
                  >
                    <p className="text-xs sm:text-sm text-slate-300 group-hover:text-white leading-relaxed transition-colors font-medium">
                      {service.description}
                    </p>
                  </motion.div>
                )}

                <ul className="space-y-2.5 mb-8 border-t border-white/10 pt-6">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={() => onSelectService(service)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-all group-hover:shadow-lg group-hover:shadow-purple-600/30"
                >
                  <span>{service.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

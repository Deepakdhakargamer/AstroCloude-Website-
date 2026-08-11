import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, LayoutDashboard, Server, Users, Cpu, Clock, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onExplorePlans: () => void;
  onOpenDashboard: () => void;
}

export function Hero({ onExplorePlans, onOpenDashboard }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background neon gradients & floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />

        {/* Grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating animated particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            initial={{
              x: Math.random() * 1200,
              y: Math.random() * 700,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              y: [null, Math.random() * -150 - 50],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column: Headings and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 text-center lg:text-left space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/60 border border-purple-500/30 backdrop-blur-md shadow-lg shadow-purple-950/40">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              Next-Gen Enterprise Cloud Infrastructure
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Powering Minecraft & <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              VPS Hosting Without Limits.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Experience absolute speed, uncompromising 99.99% uptime, and lightning-fast AMD Ryzen & EPYC infrastructure engineered for gaming communities and enterprise apps.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onExplorePlans}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Explore Plans</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-xl transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Client Dashboard</span>
            </button>
          </div>

          {/* Key highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tbps+ DDoS Defense</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant 60s Setup</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>AMD Ryzen 5.7GHz</span>
            </div>
          </div>
        </motion.div>

        {/* Right column: Animated 3D Server Illustration / Glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Glowing backdrop frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 rounded-3xl blur-2xl transform rotate-3" />

            <div className="relative w-full h-full bg-slate-900/80 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Header inside server rack mockup */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-purple-300">node-core-alpha.astro.io</span>
              </div>

              {/* Server rack units glowing */}
              <div className="space-y-4 my-auto">
                {[
                  { name: 'Minecraft Node #04', load: 38, status: 'Optimal', color: 'emerald' },
                  { name: 'NVMe VPS Cluster 01', load: 64, status: 'Balanced', color: 'blue' },
                  { name: 'Dedicated EPYC Rack', load: 22, status: 'Idle', color: 'purple' },
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.2 }}
                    className="bg-slate-950/80 border border-white/10 rounded-xl p-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{node.name}</h4>
                        <span className="text-[10px] text-slate-400">Status: {node.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-purple-300">{node.load}% CPU</span>
                      <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            node.color === 'emerald' ? 'bg-emerald-400' : node.color === 'blue' ? 'bg-blue-400' : 'bg-purple-400'
                          }`}
                          style={{ width: `${node.load}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer status badge */}
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-medium text-purple-200">Global Anycast Network Active</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">10 Gbps</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Statistics Counter Section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl py-6 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">48,500+</div>
            <div className="text-xs text-purple-300 font-medium uppercase tracking-wider mt-1">Registered Users</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">12,340</div>
            <div className="text-xs text-purple-300 font-medium uppercase tracking-wider mt-1">Active Services</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">99.99%</div>
            <div className="text-xs text-purple-300 font-medium uppercase tracking-wider mt-1">Servers Online Uptime</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">&lt; 12 mins</div>
            <div className="text-xs text-purple-300 font-medium uppercase tracking-wider mt-1">Support Response Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}

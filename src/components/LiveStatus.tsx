import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Activity, Server, Globe, Shield, Wifi } from 'lucide-react';
import { MOCK_NODES } from '../data/mockData';

export function LiveStatus() {
  const statuses = [
    { name: 'Main Website & Portal', status: 'Operational', uptime: '100%', latency: '24ms', icon: <Globe className="w-5 h-5 text-emerald-400" /> },
    { name: 'API Gateway & Auth', status: 'Operational', uptime: '99.99%', latency: '18ms', icon: <Activity className="w-5 h-5 text-emerald-400" /> },
    { name: 'Minecraft Node Clusters', status: 'Operational', uptime: '99.95%', latency: '12ms', icon: <Server className="w-5 h-5 text-emerald-400" /> },
    { name: 'NVMe VPS Nodes', status: 'Operational', uptime: '99.99%', latency: '15ms', icon: <Shield className="w-5 h-5 text-emerald-400" /> },
    { name: 'Global BGP Network', status: 'Operational', uptime: '100%', latency: '8ms', icon: <Wifi className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <section className="py-24 bg-slate-950/90 relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-4 py-1.5 rounded-full">
              Real-Time Telemetry
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              System Uptime & Nodes.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Transparent live monitoring of all core AstroCloude data centers and cloud node clusters.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 px-5 py-3 rounded-2xl">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-sm font-bold text-emerald-300">Overall Uptime: 99.99% (Last 90 Days)</span>
          </div>
        </div>

        {/* Status list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {statuses.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">{item.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-300 block font-bold">{item.uptime}</span>
                <span className="text-[10px] font-mono text-purple-300">{item.latency} ping</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Node list table */}
        <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6">Active Data Center Nodes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 uppercase tracking-wider text-[10px] text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Node Name</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">CPU Load</th>
                  <th className="pb-3 font-semibold">RAM Load</th>
                  <th className="pb-3 font-semibold">Latency</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_NODES.map((node) => (
                  <tr key={node.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-purple-400" />
                      <span>{node.name}</span>
                    </td>
                    <td className="py-4 text-slate-300">{node.location}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{node.cpuLoad}%</span>
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${node.cpuLoad}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{node.ramLoad}%</span>
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${node.ramLoad}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-purple-300">{node.ping}ms</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Operational
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

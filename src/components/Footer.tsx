import React from 'react';
import { Rocket, Github, Twitter, Disc as Discord, Shield, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <span className="text-lg font-black tracking-wider text-white">
              ASTRO<span className="text-purple-500">CLOUDE</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Next-generation enterprise cloud and game server hosting powered by AMD Ryzen & EPYC infrastructure with 99.99% uptime guarantee.
          </p>
          <div className="flex items-center gap-3">
            <a href="#discord" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-600 transition-colors">
              <Discord className="w-4 h-4" />
            </a>
            <a href="#twitter" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-600 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#github" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-600 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Hosting Services</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#services" className="hover:text-purple-400 transition-colors">Minecraft Hosting</a></li>
            <li><a href="#services" className="hover:text-purple-400 transition-colors">NVMe VPS Cloud</a></li>
            <li><a href="#services" className="hover:text-purple-400 transition-colors">Discord Bot Hosting</a></li>
            <li><a href="#services" className="hover:text-purple-400 transition-colors">Dedicated Servers</a></li>
            <li><a href="#services" className="hover:text-purple-400 transition-colors">Multi-Game Servers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Infrastructure</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#status" className="hover:text-purple-400 transition-colors">Live Node Status</a></li>
            <li><a href="#locations" className="hover:text-purple-400 transition-colors">Global Data Centers</a></li>
            <li><a href="#ddos" className="hover:text-purple-400 transition-colors">Arbor DDoS Mitigation</a></li>
            <li><a href="#sla" className="hover:text-purple-400 transition-colors">99.99% Uptime SLA</a></li>
            <li><a href="#network" className="hover:text-purple-400 transition-colors">10 Gbps BGP Uplink</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company & Legal</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#about" className="hover:text-purple-400 transition-colors">About AstroCloude</a></li>
            <li><a href="#contact" className="hover:text-purple-400 transition-colors">24/7 Expert Support</a></li>
            <li><a href="#privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
            <li><a href="#security" className="hover:text-purple-400 transition-colors">Security Disclosures</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} AstroCloude Technologies Inc. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with precision for high-availability cloud performance
        </p>
      </div>
    </footer>
  );
}

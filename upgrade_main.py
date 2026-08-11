import re

with open("src/components/UserDashboard.tsx", "r") as f:
    text = f.read()

old_main_open = """      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">
              {activeTab === 'profile' ? 'Profile Management' : activeTab === 'tickets' ? 'Support Tickets' : activeTab === 'orders' ? 'Billing & Invoices' : 'Theme & Appearance'}
            </h1>
            <p className="text-xs text-slate-400">"""

new_main_open = """      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto space-y-8 bg-slate-950/30 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/5 relative z-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 capitalize tracking-tight mb-2">
              {activeTab === 'profile' ? 'Profile Management' : activeTab === 'tickets' ? 'Support Tickets' : activeTab === 'orders' ? 'Billing & Invoices' : 'Theme & Appearance'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">"""

text = text.replace(old_main_open, new_main_open)

old_secure = """            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secure Session</span>
            </div>
          </div>
        </div>"""

new_secure = """            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-lg shadow-black/20 text-xs text-slate-300 font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Secure Session Active</span>
            </div>
          </div>
        </div>"""

text = text.replace(old_secure, new_secure)

with open("src/components/UserDashboard.tsx", "w") as f:
    f.write(text)

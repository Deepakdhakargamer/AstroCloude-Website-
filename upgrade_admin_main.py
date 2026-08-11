import re

with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()

old_main_open = """      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">
              {activeTab === 'categories' ? 'Hosting Categories' :
               activeTab === 'features' ? 'Homepage Features Management' :
               activeTab === 'plans' ? 'Hosting Plans & Pricing' :
               activeTab === 'tickets' ? 'Support Ticket System' :
               activeTab === 'users' ? 'User & Account Management' :
               activeTab === 'roles' ? 'Role & Permission RBAC' : activeTab}
            </h1>
            <p className="text-xs text-slate-400">"""

new_main_open = """      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto space-y-8 bg-slate-950/30 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/5 relative z-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 capitalize tracking-tight mb-2">
              {activeTab === 'categories' ? 'Hosting Categories' :
               activeTab === 'features' ? 'Homepage Features Management' :
               activeTab === 'plans' ? 'Hosting Plans & Pricing' :
               activeTab === 'tickets' ? 'Support Ticket System' :
               activeTab === 'users' ? 'User & Account Management' :
               activeTab === 'roles' ? 'Role & Permission RBAC' : activeTab}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">"""

text = text.replace(old_main_open, new_main_open)

old_secure = """            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SECURE_RBAC_ACTIVE
            </span>
          </div>
        </div>"""

new_secure = """            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30 shadow-lg shadow-rose-900/20 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SECURE_RBAC_ACTIVE
            </span>
          </div>
        </div>"""

text = text.replace(old_secure, new_secure)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)

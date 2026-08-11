import re

with open("src/components/AdminTicketsTab.tsx", "r") as f:
    content = f.read()

to_replace = """  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">"""

new_code = """  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const pendingTicketsCount = tickets.filter(t => t.status === 'pending').length;
  const closedTickets = tickets.filter(t => t.status === 'closed');
  
  let avgResolutionHours = 0;
  if (closedTickets.length > 0) {
    let totalMs = 0;
    closedTickets.forEach(t => {
      const created = new Date(t.createdAt).getTime();
      const resolved = new Date(t.lastUpdated).getTime();
      if (!isNaN(created) && !isNaN(resolved) && resolved > created) {
        totalMs += (resolved - created);
      }
    });
    avgResolutionHours = closedTickets.length > 0 ? (totalMs / closedTickets.length) / (1000 * 60 * 60) : 0;
  }
  const avgFormatted = avgResolutionHours > 0 ? (avgResolutionHours > 24 ? `${(avgResolutionHours / 24).toFixed(1)}d` : `${avgResolutionHours.toFixed(1)}h`) : 'N/A';

  const recentUnresolved = tickets
    .filter(t => t.status === 'open' || t.status === 'pending')
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">Action Needed</span>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{openTicketsCount}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Open Tickets</div>
            </div>
          </div>
          
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{pendingTicketsCount}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Pending Tickets</div>
            </div>
          </div>
          
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{avgFormatted}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Avg Resolution</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-purple-400" />
            Recent Unresolved
          </h3>
          <div className="space-y-3 flex-1">
            {recentUnresolved.length > 0 ? recentUnresolved.map(t => (
              <div key={t.id} onClick={() => { setActiveTicket(t); setViewMode('view'); }} className="group p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-purple-500/30 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate max-w-[150px]">{t.subject}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    t.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>{t.status}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">From: {t.userName} • {t.lastUpdated}</div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/30" />
                <span className="text-xs">All caught up!</span>
              </div>
            )}
          </div>
        </div>
      </div>

    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">"""

content = content.replace(to_replace, new_code)

with open("src/components/AdminTicketsTab.tsx", "w") as f:
    f.write(content)
print("patched list view")

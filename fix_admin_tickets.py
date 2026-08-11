with open("src/components/AdminTicketsTab.tsx", "r") as f:
    content = f.read()

content = content.replace("'replied' as const", "'in_progress' as const")
content = content.replace('<option value="replied">Replied</option>', '<option value="in_progress">In Progress</option>')

# Update activeTicket badge
old_badge = """                activeTicket.status === 'open' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                activeTicket.status === 'pending' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                activeTicket.status === 'replied' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                'bg-slate-500/20 text-slate-400 border border-slate-500/30'"""

new_badge = """                activeTicket.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                activeTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                activeTicket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'"""
content = content.replace(old_badge, new_badge)

# Update list badge
old_list_badge = """                  t.status === 'open' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                  t.status === 'pending' ? 'bg-blue-950 text-blue-400 border border-blue-500/20' :
                  t.status === 'replied' ? 'bg-purple-950 text-purple-400 border border-purple-500/20' :
                  'bg-slate-950 text-slate-400 border border-slate-500/20'"""

new_list_badge = """                  t.status === 'open' ? 'bg-green-950 text-green-400 border border-green-500/20' :
                  t.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                  t.status === 'in_progress' ? 'bg-blue-950 text-blue-400 border border-blue-500/20' :
                  'bg-red-950 text-red-400 border border-red-500/20'"""
content = content.replace(old_list_badge, new_list_badge)

# Fix open/pending status summary 
old_summary_badge = """                    t.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'"""
new_summary_badge = """                    t.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'"""
content = content.replace(old_summary_badge, new_summary_badge)

# add smooth transition class to all badges
content = content.replace(
    'className={`px-2 py-0.5 rounded-full text-[10px] font-bold',
    'className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors duration-300'
)
content = content.replace(
    'className={`px-3 py-1 rounded-full text-xs font-bold border',
    'className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-300'
)
content = content.replace(
    'className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
    'className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors duration-300'
)

with open("src/components/AdminTicketsTab.tsx", "w") as f:
    f.write(content)


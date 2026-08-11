with open("src/components/UserTicketsTab.tsx", "r") as f:
    content = f.read()

content = content.replace("'replied' as const", "'in_progress' as const")
content = content.replace("ticket.status === 'replied'", "ticket.status === 'in_progress'")
content = content.replace("activeTicket.status === 'replied'", "activeTicket.status === 'in_progress'")

# Update activeTicket badge
old_badge = """                activeTicket.status === 'open' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                activeTicket.status === 'pending' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                activeTicket.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                'bg-slate-500/20 text-slate-400 border border-slate-500/30'"""

new_badge = """                activeTicket.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                activeTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                activeTicket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'"""
content = content.replace(old_badge, new_badge)

# Update list badge
old_list_badge = """                      ticket.status === 'open' ? 'bg-amber-500/20 text-amber-400' :
                      ticket.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
                      ticket.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-slate-500/20 text-slate-400'"""

new_list_badge = """                      ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                      ticket.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'"""
content = content.replace(old_list_badge, new_list_badge)

# Add transition classes
content = content.replace(
    'className={`px-3 py-1 rounded-full text-xs font-bold border',
    'className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-300'
)
content = content.replace(
    'className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
    'className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors duration-300'
)


with open("src/components/UserTicketsTab.tsx", "w") as f:
    f.write(content)


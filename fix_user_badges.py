import re

with open("src/components/UserTicketsTab.tsx", "r") as f:
    content = f.read()

content = re.sub(
    r"activeTicket\.status === 'open'\s*\?\s*'[^\']+'\s*:\s*activeTicket\.status === 'pending'\s*\?\s*'[^\']+'\s*:\s*activeTicket\.status === 'in_progress'\s*\?\s*'[^\']+'\s*:\s*'[^']+'",
    r"activeTicket.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :\n                activeTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :\n                activeTicket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :\n                'bg-red-500/20 text-red-400 border border-red-500/30'",
    content
)

content = re.sub(
    r"ticket\.status === 'open'\s*\?\s*'[^\']+'\s*:\s*ticket\.status === 'pending'\s*\?\s*'[^\']+'\s*:\s*ticket\.status === 'in_progress'\s*\?\s*'[^\']+'\s*:\s*'[^']+'",
    r"ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :\n                      ticket.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :\n                      ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :\n                      'bg-red-500/20 text-red-400'",
    content
)

with open("src/components/UserTicketsTab.tsx", "w") as f:
    f.write(content)


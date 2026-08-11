import re

with open("src/components/AdminTicketsTab.tsx", "r") as f:
    content = f.read()

content = re.sub(
    r"activeTicket\.status === 'open'\s*\?\s*'[^\']+'\s*:\s*activeTicket\.status === 'pending'\s*\?\s*'[^\']+'\s*:\s*activeTicket\.status === 'replied'\s*\?\s*'[^\']+'\s*:\s*'[^']+'",
    r"activeTicket.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :\n                activeTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :\n                activeTicket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :\n                'bg-red-500/20 text-red-400 border border-red-500/30'",
    content
)

content = re.sub(
    r"t\.status === 'open'\s*\?\s*'[^\']+'\s*:\s*t\.status === 'pending'\s*\?\s*'[^\']+'\s*:\s*t\.status === 'replied'\s*\?\s*'[^\']+'\s*:\s*'[^']+'",
    r"t.status === 'open' ? 'bg-green-950 text-green-400 border border-green-500/20' :\n                  t.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :\n                  t.status === 'in_progress' ? 'bg-blue-950 text-blue-400 border border-blue-500/20' :\n                  'bg-red-950 text-red-400 border border-red-500/20'",
    content
)

with open("src/components/AdminTicketsTab.tsx", "w") as f:
    f.write(content)


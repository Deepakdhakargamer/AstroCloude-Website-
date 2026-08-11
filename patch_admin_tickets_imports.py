with open("src/components/AdminTicketsTab.tsx", "r") as f:
    content = f.read()

content = content.replace(
"import { Search, MessageSquare, Send, ArrowLeft } from 'lucide-react';",
"import { Search, MessageSquare, Send, ArrowLeft, Clock, AlertCircle, CheckCircle2, Ticket, Activity } from 'lucide-react';"
)

with open("src/components/AdminTicketsTab.tsx", "w") as f:
    f.write(content)
print("patched imports")

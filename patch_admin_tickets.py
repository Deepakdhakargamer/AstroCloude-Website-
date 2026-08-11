import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Replace INITIAL_TICKETS const
content = re.sub(r"const INITIAL_TICKETS: AdminSupportTicket\[\] = \[\];\n", "", content)

imports = "import { getStoredTickets, saveStoredTickets } from '../utils/ticketSync';\n"
content = content.replace("import { getStoredFeatures, saveStoredFeatures } from '../utils/featureSync';", 
"import { getStoredFeatures, saveStoredFeatures } from '../utils/featureSync';\n" + imports)

# Update state
content = content.replace("const [tickets, setTickets] = useState<AdminSupportTicket[]>(INITIAL_TICKETS);",
"""const [tickets, setTickets] = useState<AdminSupportTicket[]>(() => getStoredTickets());

  useEffect(() => {
    const handleTicketUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) setTickets((e as CustomEvent).detail);
      else setTickets(getStoredTickets());
    };
    window.addEventListener('astro_tickets_changed', handleTicketUpdate);
    return () => window.removeEventListener('astro_tickets_changed', handleTicketUpdate);
  }, []);

  const updateTicketsAndSync = (newTickets: AdminSupportTicket[]) => {
    setTickets(newTickets);
    saveStoredTickets(newTickets);
  };
""")

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)
print("AdminPanel ticket sync patched")

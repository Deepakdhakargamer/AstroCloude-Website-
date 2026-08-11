import re

with open("src/components/UserDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
"import { getStoredTickets, saveStoredTickets } from '../utils/ticketSync';",
"import { getStoredTickets, saveStoredTickets } from '../utils/ticketSync';\nimport { getStoredCategories } from '../utils/categorySync';\nimport { getStoredPlans } from '../utils/planSync';"
)

content = content.replace(
"  const [tickets, setTickets] = useState<AdminSupportTicket[]>(() => getStoredTickets());",
"""  const [tickets, setTickets] = useState<AdminSupportTicket[]>(() => getStoredTickets());
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [plans, setPlans] = useState(() => getStoredPlans());"""
)

to_replace = """          <UserTicketsTab 
            tickets={tickets.filter(t => t.userEmail === userEmail)}
            allTickets={tickets}
            userName={userName}
            userEmail={userEmail}
            onUpdate={updateTicketsAndSync}
            onShowToast={onShowToast}
          />"""

new_code = """          <UserTicketsTab 
            tickets={tickets.filter(t => t.userEmail === userEmail)}
            allTickets={tickets}
            categories={categories}
            plans={plans}
            userName={userName}
            userEmail={userEmail}
            onUpdate={updateTicketsAndSync}
            onShowToast={onShowToast}
          />"""

content = content.replace(to_replace, new_code)

with open("src/components/UserDashboard.tsx", "w") as f:
    f.write(content)
print("UserDashboard updated")

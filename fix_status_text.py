import re

def fix_status(filename):
    with open(filename, "r") as f:
        content = f.read()
    
    # replace {t.status}
    content = content.replace('{t.status}', "{t.status === 'in_progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}")
    
    # replace {activeTicket.status}
    content = content.replace('{activeTicket.status}', "{activeTicket.status === 'in_progress' ? 'In Progress' : activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}")
    
    # replace {ticket.status}
    content = content.replace('{ticket.status}', "{ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}")

    with open(filename, "w") as f:
        f.write(content)

fix_status("src/components/AdminTicketsTab.tsx")
fix_status("src/components/UserTicketsTab.tsx")

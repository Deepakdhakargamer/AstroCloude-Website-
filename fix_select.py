with open("src/components/AdminTicketsTab.tsx", "r") as f:
    content = f.read()

bad_str = "value={activeTicket.status === 'in_progress' ? 'In Progress' : activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}"
good_str = "value={activeTicket.status}"

content = content.replace(bad_str, good_str)

with open("src/components/AdminTicketsTab.tsx", "w") as f:
    f.write(content)

with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()
text = text.replace("  AdminCategory, AdminHostingPlan, AdminSupportTicket", "  AdminOrder, AdminCategory, AdminHostingPlan, AdminSupportTicket")
with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)

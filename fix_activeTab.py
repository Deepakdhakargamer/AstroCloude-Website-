with open("src/components/UserDashboard.tsx", "r") as f:
    text = f.read()

text = text.replace("activeTab === 'invoices'", "activeTab === 'orders'")

with open("src/components/UserDashboard.tsx", "w") as f:
    f.write(text)

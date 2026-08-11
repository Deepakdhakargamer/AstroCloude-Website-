with open("src/components/UserDashboard.tsx", "r") as f:
    text = f.read()

text = text.replace("onClick={() => setActiveTab('invoices')}", "onClick={() => setActiveTab('orders')}")

with open("src/components/UserDashboard.tsx", "w") as f:
    f.write(text)

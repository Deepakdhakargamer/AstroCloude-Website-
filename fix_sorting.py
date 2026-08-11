with open("src/components/AdminOrderManagementTab.tsx", "r") as f:
    text = f.read()

text = text.replace("filteredOrders.map(order => (", "filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (")

with open("src/components/AdminOrderManagementTab.tsx", "w") as f:
    f.write(text)

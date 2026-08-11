with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()

text = text.replace("import { \n  ShieldAlert", "import { \n  ShoppingCart, ShieldAlert")
text = text.replace("              { id: 'payment', label: `Payment Settings`, icon: <CreditCard className=\"w-4 h-4 text-violet-400\" /> },", "              { id: 'payment', label: `Payment Settings`, icon: <CreditCard className=\"w-4 h-4 text-violet-400\" /> },\n              { id: 'orders', label: `Orders Management`, icon: <ShoppingCart className=\"w-4 h-4 text-cyan-400\" /> },")

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)

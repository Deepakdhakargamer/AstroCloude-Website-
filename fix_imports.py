import re

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

content = content.replace("import { FileText, AdminHostingPlan }", "import { AdminHostingPlan }")
content = content.replace("import { FileText, getStoredPaymentSettings }", "import { getStoredPaymentSettings }")

with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)

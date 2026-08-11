import re

with open("src/components/UserOrdersTab.tsx", "r") as f:
    text = f.read()

# Fix the fragment closure
text = text.replace("                  )}\n                ))", "                  )}\n                </React.Fragment>\n                ))")

with open("src/components/UserOrdersTab.tsx", "w") as f:
    f.write(text)

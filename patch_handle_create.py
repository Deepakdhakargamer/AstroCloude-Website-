import re

with open("src/components/UserTicketsTab.tsx", "r") as f:
    content = f.read()

content = content.replace(
"""      category,
      status: 'open',""",
"""      category,
      relatedPlan,
      status: 'open',"""
)

with open("src/components/UserTicketsTab.tsx", "w") as f:
    f.write(content)
print("UserTicketsTab handleCreate updated")

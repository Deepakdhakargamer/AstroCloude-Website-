import re

with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

content = content.replace(
"  }).sort((a, b) => a.order - b.order);",
"  });"
)

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)
print("Staff sort fixed")

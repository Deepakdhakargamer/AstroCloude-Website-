import re

with open("src/utils/staffSync.ts", "r") as f:
    content = f.read()

content = content.replace(
"    status: 'active'\n  },",
"    status: 'active',\n    dateAdded: '2023-10-15'\n  },"
)
content = content.replace(
"    status: 'active'\n  }\n]",
"    status: 'active',\n    dateAdded: '2024-01-22'\n  }\n]"
)

with open("src/utils/staffSync.ts", "w") as f:
    f.write(content)
print("staffSync patched")

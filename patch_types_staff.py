import re

with open("src/types.ts", "r") as f:
    content = f.read()

content = content.replace(
"  status: 'active' | 'hidden';\n}",
"  status: 'active' | 'hidden';\n  dateAdded?: string;\n}"
)

with open("src/types.ts", "w") as f:
    f.write(content)
print("types patched")

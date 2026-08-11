import re

with open("src/types.ts", "r") as f:
    content = f.read()

content = content.replace("    roles: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };\n    settings: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };",
"    roles: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };\n    staff: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };\n    settings: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };")

with open("src/types.ts", "w") as f:
    f.write(content)
print("types patched")

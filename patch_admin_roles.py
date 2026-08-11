import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace("      roles: { view: true, create: true, edit: true, delete: true, manage: true },\n      settings: { view: true, create: true, edit: true, delete: true, manage: true },",
"      roles: { view: true, create: true, edit: true, delete: true, manage: true },\n      staff: { view: true, create: true, edit: true, delete: true, manage: true },\n      settings: { view: true, create: true, edit: true, delete: true, manage: true },")

content = content.replace("      roles: { view: false, create: false, edit: false, delete: false, manage: false },\n      settings: { view: true, create: false, edit: false, delete: false, manage: false },",
"      roles: { view: false, create: false, edit: false, delete: false, manage: false },\n      staff: { view: true, create: true, edit: true, delete: false, manage: true },\n      settings: { view: true, create: false, edit: false, delete: false, manage: false },")

content = content.replace("      roles: { view: false, create: false, edit: false, delete: false, manage: false },\n      settings: { view: false, create: false, edit: false, delete: false, manage: false },",
"      roles: { view: false, create: false, edit: false, delete: false, manage: false },\n      staff: { view: false, create: false, edit: false, delete: false, manage: false },\n      settings: { view: false, create: false, edit: false, delete: false, manage: false },")

content = content.replace("{(['categories', 'plans', 'tickets', 'users', 'roles', 'settings'] as const).map(mod => {",
"{(['categories', 'plans', 'tickets', 'users', 'roles', 'staff', 'settings'] as const).map(mod => {")

content = content.replace("roles: { view: true, create: true, edit: true, delete: false, manage: true },\n                            settings:",
"roles: { view: true, create: true, edit: true, delete: false, manage: true },\n                            staff: { view: true, create: true, edit: true, delete: false, manage: true },\n                            settings:")

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)
print("AdminPanel roles patched")

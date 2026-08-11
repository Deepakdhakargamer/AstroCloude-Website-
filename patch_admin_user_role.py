import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
"setUserRoleSelect('Standard User');",
"setUserRoleSelect(roles.length > 0 ? roles[0].name : 'Standard User');"
)

content = content.replace(
"const [userRoleSelect, setUserRoleSelect] = useState('Standard User');",
"const [userRoleSelect, setUserRoleSelect] = useState(roles.length > 0 ? roles[0].name : 'Standard User');"
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)
print("AdminPanel updated for user role select")

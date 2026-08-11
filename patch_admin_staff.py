import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
"""          <AdminStaffManagementTab 
            staff={staff}
            onUpdate={updateStaffAndSync}
            onShowToast={onShowToast}
          />""",
"""          <AdminStaffManagementTab 
            staff={staff}
            roles={roles}
            onUpdate={updateStaffAndSync}
            onShowToast={onShowToast}
          />"""
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)
print("AdminPanel updated to pass roles")

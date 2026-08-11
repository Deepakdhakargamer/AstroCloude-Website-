import re

with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

content = content.replace(
"import { AdminStaff } from '../types';",
"import { AdminStaff, AdminRole } from '../types';"
)

content = content.replace(
"""interface AdminStaffManagementTabProps {
  staff: AdminStaff[];
  onUpdate: (staff: AdminStaff[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}""",
"""interface AdminStaffManagementTabProps {
  staff: AdminStaff[];
  roles: AdminRole[];
  onUpdate: (staff: AdminStaff[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}"""
)

content = content.replace(
"export function AdminStaffManagementTab({ staff, onUpdate, onShowToast }: AdminStaffManagementTabProps) {",
"export function AdminStaffManagementTab({ staff, roles, onUpdate, onShowToast }: AdminStaffManagementTabProps) {"
)

# Replace the derived roles with AdminRole mapping, but wait, the existing string-based roles are extracted from staff.
# Actually, we should just use `roles.map(r => r.name)`.
# Wait, some staff might have 'Custom Role'.

content = content.replace(
"const roles = Array.from(new Set(staff.map(s => s.role)));",
"const uniqueStaffRoles = Array.from(new Set(staff.map(s => s.role)));\n  const allRoles = Array.from(new Set([...uniqueStaffRoles, ...roles.map(r => r.name)]));"
)

content = content.replace(
"""            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}""",
"""            {allRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}"""
)

content = content.replace(
"""      <AdminStaffEditor 
        staff={editingStaff || undefined} 
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditingStaff(null);
        }}
      />""",
"""      <AdminStaffEditor 
        staff={editingStaff || undefined} 
        roles={roles}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditingStaff(null);
        }}
      />"""
)

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)
print("AdminStaffManagementTab updated")

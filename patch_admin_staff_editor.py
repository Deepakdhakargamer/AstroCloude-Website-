import re

with open("src/components/AdminStaffEditor.tsx", "r") as f:
    content = f.read()

content = content.replace(
"import { AdminStaff } from '../types';",
"import { AdminStaff, AdminRole } from '../types';"
)

content = content.replace(
"""interface AdminStaffEditorProps {
  staff?: AdminStaff;
  onSave: (staff: AdminStaff) => void;
  onCancel: () => void;
}""",
"""interface AdminStaffEditorProps {
  staff?: AdminStaff;
  roles?: AdminRole[];
  onSave: (staff: AdminStaff) => void;
  onCancel: () => void;
}"""
)

content = content.replace(
"export function AdminStaffEditor({ staff, onSave, onCancel }: AdminStaffEditorProps) {",
"export function AdminStaffEditor({ staff, roles = [], onSave, onCancel }: AdminStaffEditorProps) {"
)

to_replace = """                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value="Owner">Owner</option>
                  <option value="Co-Owner">Co-Owner</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Support">Support</option>
                  <option value="Custom Role">Custom Role</option>
                </select>"""

new_code = """                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value="Owner">Owner</option>
                  <option value="Co-Owner">Co-Owner</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Support">Support</option>
                  {roles.map(r => {
                    if (!['Owner', 'Co-Owner', 'Administrator', 'Developer', 'Manager', 'Moderator', 'Support'].includes(r.name)) {
                      return <option key={r.id} value={r.name}>{r.name}</option>;
                    }
                    return null;
                  })}
                  <option value="Custom Role">Custom Role</option>
                </select>"""

content = content.replace(to_replace, new_code)

with open("src/components/AdminStaffEditor.tsx", "w") as f:
    f.write(content)
print("AdminStaffEditor updated")

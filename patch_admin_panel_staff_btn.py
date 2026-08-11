with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
"  ShieldAlert, Layers, Server, Ticket, Users, Shield, Plus, Edit3, Trash2,",
"  ShieldAlert, Layers, Server, Ticket, Users, Shield, Plus, Edit3, Trash2, Contact,"
)

to_replace = """              { id: 'users', label: `User Manager (${users.length})`, icon: <Users className="w-4 h-4 text-emerald-400" /> },
              { id: 'roles', label: `Roles & RBAC (${roles.length})`, icon: <Shield className="w-4 h-4 text-rose-400" /> },
            ].map(item => ("""

replacement = """              { id: 'users', label: `User Manager (${users.length})`, icon: <Users className="w-4 h-4 text-emerald-400" /> },
              { id: 'roles', label: `Roles & RBAC (${roles.length})`, icon: <Shield className="w-4 h-4 text-rose-400" /> },
              { id: 'staff', label: `Staff Management (${staff.length})`, icon: <Contact className="w-4 h-4 text-orange-400" /> },
            ].map(item => ("""

content = content.replace(to_replace, replacement)

content = content.replace(
"""              {activeTab === 'users' ? 'User & Account Management' :
               activeTab === 'roles' ? 'Role & Permission RBAC' : activeTab}""",
"""              {activeTab === 'users' ? 'User & Account Management' :
               activeTab === 'roles' ? 'Role & Permission RBAC' :
               activeTab === 'staff' ? 'Staff Management' : activeTab}"""
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)
print("AdminPanel staff button patched")

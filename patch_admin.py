import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Add imports
imports_to_add = """import { AdminStaff } from '../types';
import { getStoredStaff, saveStoredStaff } from '../utils/staffSync';
import { AdminStaffManagementTab } from './AdminStaffManagementTab';
"""
content = content.replace("import { getStoredFeatures, saveStoredFeatures } from '../utils/featureSync';", 
"import { getStoredFeatures, saveStoredFeatures } from '../utils/featureSync';\n" + imports_to_add)

# Add staff state
state_to_add = """  const [staff, setStaff] = useState<AdminStaff[]>(() => getStoredStaff());
  const updateStaffAndSync = (newStaff: AdminStaff[]) => {
    setStaff(newStaff);
    saveStoredStaff(newStaff);
  };
"""
content = content.replace("const [roles, setRoles] = useState<AdminRole[]>(INITIAL_ROLES);", 
"const [roles, setRoles] = useState<AdminRole[]>(INITIAL_ROLES);\n" + state_to_add)

# Add staff to activeTab state type
content = content.replace("useState<'categories' | 'plans' | 'tickets' | 'users' | 'roles' | 'features'>('categories');",
"useState<'categories' | 'plans' | 'tickets' | 'users' | 'roles' | 'features' | 'staff'>('categories');")


# Add Staff tab button
tab_btn = """        <button 
          onClick={() => setActiveTab('staff')}
          className={`flex-1 min-w-[120px] pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'staff' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            Team / Staff
          </div>
        </button>"""
content = content.replace("{/* Modules Grid */}", tab_btn + "\n{/* Modules Grid */}")


# Add Staff Tab Content
tab_content = """        {activeTab === 'staff' && (
          <AdminStaffManagementTab 
            staff={staff}
            onUpdate={updateStaffAndSync}
            onShowToast={onShowToast}
          />
        )}
"""
content = content.replace("{activeTab === 'categories' && (", tab_content + "\n        {activeTab === 'categories' && (")

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)
print("AdminPanel patched")

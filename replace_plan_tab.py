import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Add the import at the top
if "AdminPlanManagementTab" not in content:
    content = content.replace("import { AdminPlanEditor } from './AdminPlanEditor';", "import { AdminPlanEditor } from './AdminPlanEditor';\nimport { AdminPlanManagementTab } from './AdminPlanManagementTab';")

# Find the start of Plan Management
start_marker = "{/* 2. PLAN MANAGEMENT */}"
end_marker = "{/* 3. SUPPORT TICKETS */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_plan_block = """{/* 2. PLAN MANAGEMENT */}
        {activeTab === 'plans' && (
          <AdminPlanManagementTab 
            plans={plans}
            categories={categories}
            setPlans={setPlans}
            onShowToast={onShowToast}
            setIsPlanEditorOpen={setIsPlanEditorOpen}
            setEditingPlan={setEditingPlan}
          />
        )}

        """
    content = content[:start_idx] + new_plan_block + content[end_idx:]
    
    with open("src/components/AdminPanel.tsx", "w") as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Markers not found")

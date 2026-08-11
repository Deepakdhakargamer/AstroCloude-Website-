with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

old_code = """        {activeTab === 'plans' && (
          isPlanEditorOpen ? (
            <AdminPlanEditor"""

new_code = """        {activeTab === 'plans' && (
          <>
          <AnimatePresence>
          {isPlanEditorOpen && (
            <AdminPlanEditor"""

content = content.replace(old_code, new_code)

old_code2 = """              onClose={() => {
                setEditingPlan(null);
                setIsPlanEditorOpen(false);
              }}
              onShowToast={onShowToast}
            />
          ) : (
            <AdminPlanManagementTab"""

new_code2 = """              onClose={() => {
                setEditingPlan(null);
                setIsPlanEditorOpen(false);
              }}
              onShowToast={onShowToast}
            />
          )}
          </AnimatePresence>
          {!isPlanEditorOpen && (
            <AdminPlanManagementTab"""

content = content.replace(old_code2, new_code2)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

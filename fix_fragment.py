import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """          </AnimatePresence>
          {!isPlanEditorOpen && (
            <AdminPlanManagementTab""",
    """          </AnimatePresence>
          {!isPlanEditorOpen && (
            <AdminPlanManagementTab"""
)

# wait, where does the fragment end?
# It should end after the AdminPlanManagementTab block.
# Let's see:
#          {!isPlanEditorOpen && (
#            <AdminPlanManagementTab
#              ...
#            />
#          )}
#        )}

old = """            />
          )}
        )}"""

# But how to replace accurately? Let's just do it directly.

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Fix the start
old_start = """        {/* 2. PLAN MANAGEMENT */}
        {activeTab === 'plans' && (
          <>
          <AnimatePresence>
          {isPlanEditorOpen && ("""

new_start = """        {/* 2. PLAN MANAGEMENT */}
        {activeTab === 'plans' && (
          <AnimatePresence mode="wait">
          {isPlanEditorOpen ? ("""

content = content.replace(old_start, new_start)

# Add keys
content = content.replace(
    """            <AdminPlanEditor
              plan={editingPlan}""",
    """            <motion.div key="editor" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="w-full">
              <AdminPlanEditor
                plan={editingPlan}"""
)

content = content.replace(
    """              onShowToast={onShowToast}
            />
          ) : (""",
    """              onShowToast={onShowToast}
              />
            </motion.div>
          ) : ("""
)

content = content.replace(
    """          <AdminPlanManagementTab 
            plans={plans}""",
    """          <motion.div key="list" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="w-full">
            <AdminPlanManagementTab 
              plans={plans}"""
)

content = content.replace(
    """            setEditingPlan={setEditingPlan}
          />
          )
        )}""",
    """            setEditingPlan={setEditingPlan}
            />
          </motion.div>
          )}
          </AnimatePresence>
        )}"""
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

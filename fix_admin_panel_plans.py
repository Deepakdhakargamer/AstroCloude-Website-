with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

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

old_end = """              onClose={() => {
                setIsPlanEditorOpen(false);
                setEditingPlan(undefined);
              }}
              onShowToast={onShowToast}
            />
          ) : ("""

new_end = """              onClose={() => {
                setIsPlanEditorOpen(false);
                setEditingPlan(undefined);
              }}
              onShowToast={onShowToast}
            />
          ) : ("""

# wait, I don't need to replace the end if I use mode="wait" and a ternary? 
# If I use `isPlanEditorOpen ? ( ... ) : ( ... )`, it works perfectly with AnimatePresence mode="wait" as long as they have unique keys.
# Let's just restore the start to use ternary!

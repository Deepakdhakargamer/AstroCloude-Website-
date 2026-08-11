with open("src/components/AdminPlanManagementTab.tsx", "r") as f:
    content = f.read()

content = content.replace("import Reactimport React", "import React")

with open("src/components/AdminPlanManagementTab.tsx", "w") as f:
    f.write(content)

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """                </div>
                <div className="pt-6 border-t border-white/5">
                  <button""",
    """                </div>
                </motion.div>
                <div className="pt-6 border-t border-white/5">
                  <button"""
)
# Actually let's just restore Checkout.tsx from git and manually fix it, or find out what happened in Checkout.tsx.

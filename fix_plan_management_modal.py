with open("src/components/AdminPlanManagementTab.tsx", "r") as f:
    content = f.read()

if "AnimatePresence" not in content:
    if "import { motion } from 'motion/react';" in content:
        content = content.replace("import { motion } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';")
    else:
        content = content.replace("import React", "import React\nimport { motion, AnimatePresence } from 'motion/react';", 1)

old_code = """      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">"""

new_code = """      {/* Delete Confirmation Modal */}
      <AnimatePresence>
      {deleteConfirmModal.open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">"""

content = content.replace(old_code, new_code)
content = content.replace(
    """                </button>
              </div>
            </div>
          </div>
        </div>
      )}""",
    """                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>"""
)

with open("src/components/AdminPlanManagementTab.tsx", "w") as f:
    f.write(content)

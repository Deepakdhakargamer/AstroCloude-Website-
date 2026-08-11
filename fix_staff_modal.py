with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

if "AnimatePresence" not in content:
    content = content.replace("import { motion } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';")

old_code = """      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-rose-500/10"
          >"""

new_code = """      <AnimatePresence>
      {deletingId && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-rose-500/10"
          >"""

content = content.replace(old_code, new_code)
content = content.replace(
    """              </button>
            </div>
          </motion.div>
        </div>
      )}""",
    """              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>"""
)

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)

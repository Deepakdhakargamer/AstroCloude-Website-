import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Add AnimatePresence import
if "AnimatePresence" not in content:
    content = content.replace("import { motion } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';")

# Feature Modal
feature_old = """            {/* Comprehensive Feature Modal */}
              {featureModal.open && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">"""

feature_new = """            {/* Comprehensive Feature Modal */}
            <AnimatePresence>
              {featureModal.open && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">"""

content = content.replace(feature_old, feature_new)
content = content.replace(
    """                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}""",
    """                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>"""
)

# wait, replacing the exact closing tags is hard because there are multiple `</div>` sequences.
# Instead of replacing, I can use regex to find the blocks. Or I can do it file by file carefully.

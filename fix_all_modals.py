with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

def wrap_modal(content, condition_str, old_wrapper_start, old_wrapper_end):
    # This is a bit tricky, let's just do text replacements for known exact strings
    pass

# We can replace the start and end of these modals manually.

# 1. categoryModal
old_category = """            {/* Comprehensive Category Modal */}
            {categoryModal.open && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">"""
new_category = """            {/* Comprehensive Category Modal */}
            <AnimatePresence>
            {categoryModal.open && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">"""
content = content.replace(old_category, new_category)

old_category_end = """                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}"""
# Wait, checking the end of categoryModal is hard. Let's find the closing tags.
# Actually I can just search for `<div className="fixed inset-0 bg-black/85` or similar and replace them.

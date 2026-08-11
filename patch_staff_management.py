import re

with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

# Add state for delete confirmation
delete_state = """  const [deletingId, setDeletingId] = useState<string | null>(null);"""
content = content.replace("const [roleFilter, setRoleFilter] = useState<string>('all');", "const [roleFilter, setRoleFilter] = useState<string>('all');\n" + delete_state)

# Replace handleDelete
new_handle_delete = """  const confirmDelete = (id: string) => {
    onUpdate(staff.filter(s => s.id !== id));
    onShowToast('Staff member deleted', 'info');
    setDeletingId(null);
  };"""
content = re.sub(r"const handleDelete = \(id: string\) => \{[\s\S]*?\};", new_handle_delete, content)

# Replace onClick handleDelete
content = content.replace("onClick={() => handleDelete(member.id)}", "onClick={() => setDeletingId(member.id)}")

# Add Delete Modal UI at the end
modal_ui = """
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-rose-500/10"
          >
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Staff Member?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to remove this staff member? This action cannot be undone and they will be removed from the website immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
              >
                Delete Staff
              </button>
            </div>
          </motion.div>
        </div>
      )}
"""
content = content.replace("    </div>\n  );\n}", modal_ui + "\n    </div>\n  );\n}")

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)
print("Patched AdminStaffManagementTab")

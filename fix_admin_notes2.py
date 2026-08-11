import re

with open("src/components/AdminOrderManagementTab.tsx", "r") as f:
    text = f.read()

# Update the clear note call when XCircle is clicked
text = text.replace("setSelectedOrder(null); setRejectionReason('');", "setSelectedOrder(null); setRejectionReason(''); setAdminNote('');")

admin_note_html = """
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300">Admin Note</label>
                    <textarea
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Add an internal note or message to the user..."
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                    />
                    {selectedOrder.status !== 'pending_verification' && (
                      <button
                        onClick={handleSaveNote}
                        className="w-full py-2 rounded-xl text-sm font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                      >
                        Save Note
                      </button>
                    )}
                  </div>
"""

# Insert admin_note_html before the rejection reason block
text = text.replace("{selectedOrder.status === 'pending_verification' && (\n                     <div className=\"space-y-3\">", admin_note_html + "\n                  {selectedOrder.status === 'pending_verification' && (\n                     <div className=\"space-y-3\">")

# Fix button clicks to pass adminNote
text = text.replace("handleStatusChange(selectedOrder.id, 'rejected', rejectionReason);", "handleStatusChange(selectedOrder.id, 'rejected', rejectionReason, adminNote);")
text = text.replace("handleStatusChange(selectedOrder.id, 'approved')", "handleStatusChange(selectedOrder.id, 'approved', undefined, adminNote)")

with open("src/components/AdminOrderManagementTab.tsx", "w") as f:
    f.write(text)

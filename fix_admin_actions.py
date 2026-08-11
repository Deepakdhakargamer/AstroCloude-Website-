with open("src/components/AdminOrderManagementTab.tsx", "r") as f:
    text = f.read()

import re

new_buttons = """                  {selectedOrder.status === 'pending_verification' ? (
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => {
                          if (!rejectionReason.trim()) {
                            onShowToast('Please provide a reason for rejection.', 'error');
                            return;
                          }
                          handleStatusChange(selectedOrder.id, 'rejected', rejectionReason);
                        }}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        Reject Order
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'approved')}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                      >
                        Approve Order
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'pending_verification')}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                      >
                        Mark as Pending Verification
                      </button>
                    </div>
                  )}"""

# Replace the block
text = re.sub(r"\{\s*selectedOrder\.status === 'pending_verification' && \(\s*<div className=\"flex gap-3 pt-4\">.*?</div>\s*\)\s*\}", new_buttons, text, flags=re.DOTALL)

with open("src/components/AdminOrderManagementTab.tsx", "w") as f:
    f.write(text)

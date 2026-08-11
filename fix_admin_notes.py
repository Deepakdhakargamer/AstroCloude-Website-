import re

with open("src/components/AdminOrderManagementTab.tsx", "r") as f:
    text = f.read()

# Add state
text = text.replace("const [rejectionReason, setRejectionReason] = useState('');", 
                    "const [rejectionReason, setRejectionReason] = useState('');\n  const [adminNote, setAdminNote] = useState('');")

# Update selection logic
text = text.replace("onClick={() => setSelectedOrder(order)}",
                    "onClick={() => { setSelectedOrder(order); setRejectionReason(order.rejectionReason || ''); setAdminNote(order.adminNote || ''); }}")

# Update clear logic
text = text.replace("setSelectedOrder(null); setRejectionReason('');",
                    "setSelectedOrder(null); setRejectionReason(''); setAdminNote('');")

# Update handleStatusChange
old_status_change = """  const handleStatusChange = (orderId: string, newStatus: AdminOrder['status'], reason?: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          rejectionReason: reason || undefined,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });"""

new_status_change = """  const handleStatusChange = (orderId: string, newStatus: AdminOrder['status'], reason?: string, note?: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          rejectionReason: reason || undefined,
          adminNote: note !== undefined ? note : o.adminNote,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });"""
text = text.replace(old_status_change, new_status_change)

# Also create a function to just save the note
save_note_func = """
  const handleSaveNote = () => {
    if (!selectedOrder) return;
    const updated = orders.map(o => o.id === selectedOrder.id ? { ...o, adminNote, updatedAt: new Date().toISOString() } : o);
    onUpdate(updated);
    onShowToast('Admin note saved successfully.', 'success');
  };
"""

text = text.replace("const handleDelete = (orderId: string) => {", save_note_func + "\n  const handleDelete = (orderId: string) => {")

with open("src/components/AdminOrderManagementTab.tsx", "w") as f:
    f.write(text)

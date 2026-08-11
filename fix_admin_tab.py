with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()

import re

# Import the new tab
text = text.replace("import { AdminPaymentSettingsTab } from './AdminPaymentSettingsTab';", "import { AdminPaymentSettingsTab } from './AdminPaymentSettingsTab';\nimport { AdminOrderManagementTab } from './AdminOrderManagementTab';")

# Add to render block
render_block = """        {activeTab === 'payment' && (
          <AdminPaymentSettingsTab 
            paymentSettings={paymentSettings}
            onUpdate={updatePaymentSettingsAndSync}
            onShowToast={onShowToast}
          />
        )}
        {activeTab === 'orders' && (
          <AdminOrderManagementTab 
            orders={orders}
            onUpdate={updateOrdersAndSync}
            onShowToast={onShowToast}
          />
        )}"""

text = text.replace("""        {activeTab === 'payment' && (
          <AdminPaymentSettingsTab 
            paymentSettings={paymentSettings}
            onUpdate={updatePaymentSettingsAndSync}
            onShowToast={onShowToast}
          />
        )}""", render_block)

# Add updateOrdersAndSync function
update_func = """  const updatePaymentSettingsAndSync = (updated: PaymentSettings) => {
    setPaymentSettings(updated);
    saveStoredPaymentSettings(updated);
  };
  
  const updateOrdersAndSync = (updated: AdminOrder[]) => {
    setOrders(updated);
    updateStoredOrders(updated);
  };"""

text = text.replace("""  const updatePaymentSettingsAndSync = (updated: PaymentSettings) => {
    setPaymentSettings(updated);
    saveStoredPaymentSettings(updated);
  };""", update_func)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)

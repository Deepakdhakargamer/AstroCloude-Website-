with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Add Payment Setting to Sidebar array
old_array = """            ].map(item => ("""
new_array = """              { id: 'payment', label: `Payment Settings`, icon: <CreditCard className="w-4 h-4 text-violet-400" /> },
            ].map(item => ("""
if "{ id: 'payment'" not in content:
    content = content.replace(old_array, new_array)

# Add Payment Tab to Render
old_render = """          {activeTab === 'staff' && (
          <AdminStaffManagementTab 
            staff={staff}
            roles={roles}
            onUpdate={updateStaffAndSync}
            onShowToast={onShowToast}
          />
        )}"""

new_render = """          {activeTab === 'staff' && (
          <AdminStaffManagementTab 
            staff={staff}
            roles={roles}
            onUpdate={updateStaffAndSync}
            onShowToast={onShowToast}
          />
        )}
        
        {activeTab === 'payment' && (
          <AdminPaymentTab 
            settings={paymentSettings}
            onUpdate={updatePaymentAndSync}
            onShowToast={onShowToast}
          />
        )}"""
if "AdminPaymentTab \n" not in content and "AdminPaymentTab\n" not in content and "AdminPaymentTab " not in content[content.find('activeTab === \'payment\''):]:
    content = content.replace(old_render, new_render)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

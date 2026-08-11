import re
with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()

# Add import
if "AdminOrderManagementTab" not in text:
    text = text.replace("import { AdminPlanManagementTab } from './AdminPlanManagementTab';", "import { AdminPlanManagementTab } from './AdminPlanManagementTab';\nimport { AdminOrderManagementTab } from './AdminOrderManagementTab';")

# Add render block
if "activeTab === 'orders'" not in text:
    # replace activeTab logic in header
    text = text.replace("activeTab === 'users' ? 'User & Account Management' :\\n               activeTab === 'roles' ? 'Role & Permission RBAC' : activeTab",
                        "activeTab === 'users' ? 'User & Account Management' :\\n               activeTab === 'roles' ? 'Role & Permission RBAC' :\\n               activeTab === 'orders' ? 'Orders Management' : activeTab")

    # add component
    render_block = """        {activeTab === 'roles' && (
"""
    new_render_block = """        {activeTab === 'orders' && (
          <AdminOrderManagementTab orders={orders} onUpdate={updateStoredOrders} onShowToast={onShowToast} />
        )}
        {activeTab === 'roles' && ("""
    
    text = text.replace(render_block, new_render_block)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)

import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { AdminPlanEditor } from './AdminPlanEditor';",
    "import { AdminPlanEditor } from './AdminPlanEditor';\nimport { AdminPaymentTab } from './AdminPaymentTab';\nimport { getStoredPaymentSettings, saveStoredPaymentSettings, PaymentSettings } from '../utils/paymentSync';"
)

# 2. Add payment settings state
state_replace = """  const [staff, setStaff] = useState<AdminStaff[]>(() => getStoredStaff());
  const updateStaffAndSync = (newStaff: AdminStaff[]) => {
    setStaff(newStaff);
    saveStoredStaff(newStaff);
  };"""

new_state = state_replace + """\n  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => getStoredPaymentSettings());
  const updatePaymentAndSync = (newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);
    saveStoredPaymentSettings(newSettings);
  };"""

content = content.replace(state_replace, new_state)

# 3. Add to sidebar
sidebar_old = """              <button
                onClick={() => setActiveTab('staff')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'staff'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Staff Management</span>
              </button>"""

sidebar_new = sidebar_old + """
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'payment'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payment Settings</span>
              </button>"""

content = content.replace(sidebar_old, sidebar_new)

# 4. Add header text
content = content.replace(
    "activeTab === 'staff' ? 'Staff Management' :",
    "activeTab === 'staff' ? 'Staff Management' :\n               activeTab === 'payment' ? 'Payment Settings' :"
)

# 5. Add rendering component
render_old = """          {activeTab === 'staff' && (
            <AdminStaffTab
              staff={staff}
              roles={roles}
              onUpdate={updateStaffAndSync}
              onShowToast={onShowToast}
            />
          )}"""

render_new = render_old + """
          {activeTab === 'payment' && (
            <AdminPaymentTab
              settings={paymentSettings}
              onUpdate={updatePaymentAndSync}
              onShowToast={onShowToast}
            />
          )}"""

content = content.replace(render_old, render_new)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)


import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "import { RequestPlanModal } from './components/RequestPlanModal';",
    "import { Checkout } from './components/Checkout';"
)

old_handle = """  const handleOpenRequestPlan = (plan?: AdminHostingPlan) => {
    setSelectedPlan(plan || (getStoredPlans().length > 0 ? getStoredPlans()[0] : null as any));
    setRequestModalOpen(true);
  };"""

new_handle = """  const handleOpenRequestPlan = (plan?: AdminHostingPlan) => {
    setSelectedPlan(plan || (getStoredPlans().length > 0 ? getStoredPlans()[0] : null as any));
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };"""

content = content.replace(old_handle, new_handle)

old_modal = """      {/* Plan Request Modal */}
      <RequestPlanModal
        isOpen={requestModalOpen}
        plan={selectedPlan}
        onClose={() => setRequestModalOpen(false)}
        onSubmit={handlePlanSubmitted}
      />"""

content = content.replace(old_modal, "")

new_checkout = """
      {currentView === 'checkout' && (
        <Checkout
          plan={selectedPlan}
          onBack={() => {
            setCurrentView('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShowToast={showToast}
        />
      )}
"""

content = content.replace("    </div>\n  );\n}", new_checkout + "    </div>\n  );\n}")

with open("src/App.tsx", "w") as f:
    f.write(content)


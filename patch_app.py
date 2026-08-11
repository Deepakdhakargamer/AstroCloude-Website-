with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "import { RequestPlanModal }", 
    "import { CategoryPlans } from './components/CategoryPlans';\nimport { RequestPlanModal }"
)

content = content.replace(
    "const [currentView, setCurrentView] = useState<ViewMode>('public');\n  const [requestModalOpen",
    "const [currentView, setCurrentView] = useState<ViewMode>('public');\n  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);\n  const [requestModalOpen"
)

content = content.replace(
"""          <Services
            onSelectService={(service) => {
              scrollToPlans();
            }}
          />""",
"""          <Services
            onSelectService={(service) => {
              setSelectedCategoryId(service.id);
              setCurrentView('categoryPlans');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />"""
)

content = content.replace(
"""      {currentView === 'admin' && (
        <AdminPanel
          onShowToast={showToast}
        />
      )}""",
"""      {currentView === 'admin' && (
        <AdminPanel
          onShowToast={showToast}
        />
      )}
      {currentView === 'categoryPlans' && selectedCategoryId && (
        <CategoryPlans
          categoryId={selectedCategoryId}
          onBack={() => {
            setCurrentView('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRequestPlan={(plan) => handleOpenRequestPlan(plan)}
        />
      )}"""
)

with open("src/App.tsx", "w") as f:
    f.write(content)

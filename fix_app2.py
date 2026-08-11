with open("src/App.tsx", "r") as f:
    content = f.read()

import re
content = re.sub(r"      \{currentView === 'checkout' && \(\n        <Checkout[\s\S]*?      \)\}\n", "", content)

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

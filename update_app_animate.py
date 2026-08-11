import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add AnimatePresence import
if "AnimatePresence" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { AnimatePresence } from 'motion/react';")

# Wrap Checkout in AnimatePresence
old_checkout = """      {currentView === 'checkout' && (
        <Checkout
          plan={selectedPlan}
          onBack={() => {
            setCurrentView('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShowToast={showToast}
        />
      )}"""

new_checkout = """      <AnimatePresence>
        {currentView === 'checkout' && (
          <Checkout
            key="checkout-view"
            plan={selectedPlan}
            onBack={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}
      </AnimatePresence>"""

content = content.replace(old_checkout, new_checkout)

with open("src/App.tsx", "w") as f:
    f.write(content)

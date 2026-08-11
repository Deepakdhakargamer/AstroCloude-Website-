import re

with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()
if "AnimatePresence" not in text and "from 'motion/react';" in text:
    text = text.replace("import { motion } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';")
elif "AnimatePresence" not in text:
    text = text.replace("import React", "import React\nimport { motion, AnimatePresence } from 'motion/react';", 1)
with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)

with open("src/components/AdminPlanManagementTab.tsx", "r") as f:
    text = f.read()
text = text.replace("import React, { useState, useMemo } from 'react';\nimport React, { useState, useMemo } from 'react';", "import React, { useState, useMemo } from 'react';")
with open("src/components/AdminPlanManagementTab.tsx", "w") as f:
    f.write(text)

with open("src/App.tsx", "r") as f:
    text = f.read()
text = text.replace('key="checkout-view"', '')
with open("src/App.tsx", "w") as f:
    f.write(text)

with open("src/components/Checkout.tsx", "r") as f:
    text = f.read()
# Checkout.tsx(225,106): error TS2551: Property 'category' does not exist on type 'AdminHostingPlan'. Did you mean 'categoryId'?
text = text.replace("plan.category", "plan.categoryId")
# Checkout.tsx(270,93): error TS2345: Argument of type 'number | "0"' is not assignable to parameter of type 'string'
# parseFloat(plan.price || '0')
text = text.replace("parseFloat(plan.price || '0')", "parseFloat(plan.price?.toString() || '0')")
with open("src/components/Checkout.tsx", "w") as f:
    f.write(text)


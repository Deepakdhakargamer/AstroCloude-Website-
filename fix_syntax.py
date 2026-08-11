with open("src/components/AdminPlanManagementTab.tsx", "r") as f:
    content = f.read()

content = content.replace("import { motion, AnimatePresence } from 'motion/react';, { useState, useMemo } from 'react';", "import React, { useState, useMemo } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';")

with open("src/components/AdminPlanManagementTab.tsx", "w") as f:
    f.write(content)

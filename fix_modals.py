import os
import re

for filename in os.listdir("src/components"):
    if not filename.endswith(".tsx"): continue
    path = os.path.join("src/components", filename)
    with open(path, "r") as f:
        content = f.read()
    
    if "fixed inset-0" in content:
        # Check if motion is imported
        if "motion/react" not in content and "framer-motion" not in content:
            if "import React" in content:
                content = content.replace("import React", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\n//")
                # Wait, this might corrupt imports, let's just do a simple replace
                pass

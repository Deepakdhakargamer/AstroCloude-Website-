with open("src/components/AdminPlanManagementTab.tsx", "r") as f:
    content = f.read()

content = content.replace("import React", "import React, { useState, useMemo } from 'react';\n", 1)

with open("src/components/AdminPlanManagementTab.tsx", "w") as f:
    f.write(content)

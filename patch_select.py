import re
import os

files = [
    "src/components/AdminPanel.tsx",
    "src/components/AdminStaffEditor.tsx",
    "src/components/AdminPlanEditor.tsx",
    "src/components/UserTicketsTab.tsx",
    "src/components/AdminStaffManagementTab.tsx",
    "src/components/AdminTicketsTab.tsx"
]

def add_chevron_import(content):
    if "ChevronDown" not in content:
        # Find lucide-react import
        content = re.sub(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];', r'import {\1, ChevronDown} from "lucide-react";', content)
    return content

for file in files:
    with open(file, "r") as f:
        content = f.read()
    
    content = add_chevron_import(content)

    # For AdminTicketsTab specifically
    if file == "src/components/AdminTicketsTab.tsx":
        content = content.replace(
            '<div className="flex items-center gap-2">\n            <select',
            '<div className="flex items-center gap-2 relative">\n            <select'
        ).replace(
            'px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"',
            'pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"'
        ).replace(
            '</select>\n          </div>',
            '</select>\n            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />\n          </div>'
        )

    with open(file, "w") as f:
        f.write(content)
print("patched")

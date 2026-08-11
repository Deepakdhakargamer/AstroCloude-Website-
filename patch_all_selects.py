import re
import os

files = [
    "src/components/AdminPanel.tsx",
    "src/components/AdminStaffEditor.tsx",
    "src/components/AdminPlanEditor.tsx",
]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Find all <select> elements that don't have appearance-none yet
    # We will wrap them in <div className="relative"> and add ChevronDown
    
    # We use regex to find <select ... > ... </select> block
    # This is tricky with regex, but we can do it by finding <select and its matching </select>
    
    def replacer(match):
        select_tag = match.group(0)
        
        # If it already has appearance-none, skip it
        if "appearance-none" in select_tag:
            return select_tag
            
        # Add appearance-none to className
        select_tag = re.sub(
            r'className="([^"]+)"',
            lambda m: f'className="{m.group(1).replace("px-", "pl-4 pr-10 py-")} appearance-none"',
            select_tag
        )
        
        # Ensure it has pr-10 if not added by the above replace
        if "pr-10" not in select_tag and "pr-8" not in select_tag:
             select_tag = re.sub(
                r'className="([^"]+)"',
                lambda m: f'className="{m.group(1)} pr-10"',
                select_tag
            )
            
        return f'<div className="relative">\n{select_tag}\n<ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />\n</div>'

    # Non-greedy match for <select> ... </select>
    new_content = re.sub(r'(<select[^>]*>.*?</select>)', replacer, content, flags=re.DOTALL)
    
    # In some places, <select> is self-closing? No, it's not.
    
    with open(file, "w") as f:
        f.write(new_content)

print("patched all selects")

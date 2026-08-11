import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Fix the broken HTML tags caused by previous script
# Pattern looks like:
# <div className="relative"><select ... > ... </select><ChevronDown ... /></div>
# <ChevronDown ... />
# </div>
# </div>

fixed_content = re.sub(
    r'<div className="relative"><select([^>]+)>(.*?)</select><ChevronDown[^>]+></div>\s*<ChevronDown[^>]+>\s*</div>\s*</div>',
    r'<div className="relative">\n<select\1>\2</select>\n<ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />\n</div>\n</div>',
    content,
    flags=re.DOTALL
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(fixed_content)

print("fixed AdminPanel 2")

import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

fixed = re.sub(
    r'<div className="relative"><select([^>]+value={featColorTheme}[^>]+)>(.*?)</select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>\s*<ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />\s*</div>\s*</div>',
    r'<div className="relative">\n<select\1>\2</select>\n<ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />\n</div>\n</div>',
    content,
    flags=re.DOTALL
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(fixed)

print("fixed AdminPanel 4")

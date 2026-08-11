with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '</select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>',
    '</select>\n<ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />'
)

content = content.replace(
    '<div className="relative"><select',
    '<select'
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

print("fixed AdminPanel 6")

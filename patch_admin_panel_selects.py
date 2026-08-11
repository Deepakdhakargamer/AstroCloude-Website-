with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# For feature modal status
content = content.replace(
    '<select\n                                value={featStatus}',
    '<div className="relative">\n                              <select\n                                value={featStatus}'
).replace(
    'className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"',
    'className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"'
).replace(
    '</select>\n                            </div>',
    '</select>\n                              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />\n                            </div>\n                            </div>'
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

print("patched admin panel 1")

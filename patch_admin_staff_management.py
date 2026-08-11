with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '<select\n            value={roleFilter}',
    '<div className="relative">\n            <select\n              value={roleFilter}'
).replace(
    'className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500"',
    'className="bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500 appearance-none"'
).replace(
    '</select>\n        </div>',
    '</select>\n            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />\n          </div>\n        </div>'
)

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)

print("patched admin staff management")

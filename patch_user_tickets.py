with open("src/components/UserTicketsTab.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '<label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>\n                <select',
    '<label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>\n                <div className="relative">\n                  <select'
).replace(
    '<label className="block text-xs font-semibold text-slate-300 mb-2">Related Plan / Service</label>\n                <select',
    '<label className="block text-xs font-semibold text-slate-300 mb-2">Related Plan / Service</label>\n                <div className="relative">\n                  <select'
).replace(
    '<label className="block text-xs font-semibold text-slate-300 mb-2">Priority</label>\n                <select',
    '<label className="block text-xs font-semibold text-slate-300 mb-2">Priority</label>\n                <div className="relative">\n                  <select'
).replace(
    'px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"',
    'pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"'
).replace(
    '</select>\n              </div>',
    '</select>\n                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />\n                </div>\n              </div>'
)

with open("src/components/UserTicketsTab.tsx", "w") as f:
    f.write(content)

print("patched user tickets")

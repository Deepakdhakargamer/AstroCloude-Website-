with open("src/components/AdminPanel.tsx", "r") as f:
    lines = f.readlines()

out = []
for line in lines:
    if '</select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>' in line:
        out.append('                              </select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />\n')
    elif '<ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />' in line and '</div>' not in line:
        pass # skip the extra chevron line
    elif '<div className="relative"><select' in line:
        out.append(line.replace('<div className="relative"><select', '<select'))
    else:
        out.append(line)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.writelines(out)

print("fixed AdminPanel 5")

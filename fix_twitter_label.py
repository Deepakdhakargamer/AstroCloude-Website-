with open("src/components/AdminStaffEditor.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "<label className=\"block text-xs text-slate-400 mb-1 capitalize\">{platform}</label>",
    "<label className=\"block text-xs text-slate-400 mb-1 capitalize\">{platform === 'twitter' ? 'X (Twitter)' : platform}</label>"
)

with open("src/components/AdminStaffEditor.tsx", "w") as f:
    f.write(content)
print("Patched Twitter label")

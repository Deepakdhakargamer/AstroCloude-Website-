import re

with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

to_replace = """  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">"""

new_code = """  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Staff Overview</h2>
          <p className="text-sm text-slate-400">Manage your team members and their roles.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{staff.length}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Total Staff</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">"""

content = content.replace(to_replace, new_code)

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)
print("AdminStaffManagementTab top patched")

import re

with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

# Add Discord icon import
content = content.replace("import { Plus, Search, Edit3, Trash2, Eye, EyeOff, ShieldAlert, Star } from 'lucide-react';",
"import { Plus, Search, Edit3, Trash2, Eye, EyeOff, ShieldAlert, Star, MessageSquare, Calendar } from 'lucide-react';")

to_replace = """                <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-white/5 pt-4">
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                  Order: {member.order}
                </div>"""

new_code = """                <div className="space-y-2 border-t border-white/5 pt-4">
                  {member.discordUsername && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      {member.discordUsername}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-slate-500" />
                      Order: {member.order}
                    </div>
                    {member.dateAdded && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {member.dateAdded}
                      </div>
                    )}
                  </div>
                </div>"""

content = content.replace(to_replace, new_code)

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)
print("AdminStaffManagementTab patched")

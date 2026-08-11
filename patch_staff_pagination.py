import re

with open("src/components/AdminStaffManagementTab.tsx", "r") as f:
    content = f.read()

# Add pagination state
content = content.replace("const [deletingId, setDeletingId] = useState<string | null>(null);",
"""const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;""")

# Add pagination icons
content = content.replace("import { Plus, Search, Edit3, Trash2, Eye, EyeOff, ShieldAlert, Star, MessageSquare, Calendar } from 'lucide-react';",
"import { Plus, Search, Edit3, Trash2, Eye, EyeOff, ShieldAlert, Star, MessageSquare, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';")

# Reset page on filter/search
content = content.replace("onChange={(e) => setSearchQuery(e.target.value)}", "onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}")
content = content.replace("onChange={(e) => setRoleFilter(e.target.value)}", "onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}")

# Slice filteredStaff
content = content.replace(
"        {filteredStaff.map((member) => (",
"""        {filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((member) => (""")

# Add pagination controls
pagination_ui = """
      {filteredStaff.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <span className="text-xs text-slate-400">
            Showing {Math.min(filteredStaff.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredStaff.length, currentPage * itemsPerPage)} of {filteredStaff.length} staff
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 disabled:opacity-50 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-white px-2">Page {currentPage} of {Math.ceil(filteredStaff.length / itemsPerPage)}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredStaff.length / itemsPerPage), prev + 1))}
              disabled={currentPage === Math.ceil(filteredStaff.length / itemsPerPage)}
              className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 disabled:opacity-50 hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}"""

content = content.replace("      {filteredStaff.length === 0 && (", pagination_ui + "\n      {filteredStaff.length === 0 && (")

with open("src/components/AdminStaffManagementTab.tsx", "w") as f:
    f.write(content)
print("Pagination patched")

import React, { useState } from 'react';
import { AdminStaff, AdminRole } from '../types';
import { AdminStaffEditor } from './AdminStaffEditor';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, ShieldAlert, Star, MessageSquare, Calendar, ChevronLeft, ChevronRight , ChevronDown} from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';

interface AdminStaffManagementTabProps {
  staff: AdminStaff[];
  roles: AdminRole[];
  onUpdate: (staff: AdminStaff[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdminStaffManagementTab({ staff, roles, onUpdate, onShowToast }: AdminStaffManagementTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaff | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const uniqueStaffRoles = Array.from(new Set(staff.map(s => s.role)));
  const allRoles = Array.from(new Set([...uniqueStaffRoles, ...roles.map(r => r.name)]));

  const handleSave = (savedStaff: AdminStaff) => {
    let newStaffList;
    if (editingStaff) {
      newStaffList = staff.map(s => s.id === savedStaff.id ? savedStaff : s);
      onShowToast('Staff member updated successfully', 'success');
    } else {
      newStaffList = [...staff, savedStaff];
      onShowToast('Staff member added successfully', 'success');
    }
    onUpdate(newStaffList);
    setIsEditing(false);
    setEditingStaff(null);
  };

    const confirmDelete = (id: string) => {
    onUpdate(staff.filter(s => s.id !== id));
    onShowToast('Staff member deleted', 'info');
    setDeletingId(null);
  };

  const toggleStatus = (id: string) => {
    onUpdate(staff.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'active' ? 'hidden' : 'active' };
      }
      return s;
    }));
    onShowToast('Staff status updated', 'success');
  };

  if (isEditing) {
    return (
      <AdminStaffEditor 
        staff={editingStaff || undefined} 
        roles={roles}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditingStaff(null);
        }}
      />
    );
  }

  return (
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

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500 appearance-none"
          >
            <option value="all">All Roles</option>
            {allRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={() => {
            setEditingStaff(null);
            setIsEditing(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-lg transition-all ${
              member.status === 'hidden' ? 'opacity-60 border-white/5' : 'border-white/10 hover:border-purple-500/30'
            }`}
          >
            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              {member.featured && (
                <div className="absolute top-3 right-3 bg-purple-500/20 text-purple-300 p-1.5 rounded-lg backdrop-blur-md">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <img 
                  src={member.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl border-4 border-slate-900 object-cover bg-slate-800"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleStatus(member.id)}
                    className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-white/5"
                    title={member.status === 'active' ? 'Hide Staff' : 'Show Staff'}
                  >
                    {member.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => {
                      setEditingStaff(member);
                      setIsEditing(true);
                    }}
                    className="p-2 bg-slate-800 text-blue-400 hover:text-blue-300 rounded-lg transition-colors border border-white/5"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeletingId(member.id)}
                    className="p-2 bg-slate-800 text-rose-400 hover:text-rose-300 rounded-lg transition-colors border border-white/5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {member.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">@{member.username}</p>
                
                <span 
                  className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4 border"
                  style={{ 
                    backgroundColor: `${member.badgeColor}20`, 
                    color: member.badgeColor,
                    borderColor: `${member.badgeColor}30` 
                  }}
                >
                  {member.role === 'Custom Role' ? member.customRoleName : member.role}
                </span>

                <p className="text-sm text-slate-300 line-clamp-2 mb-4">
                  {member.shortBio}
                </p>

                <div className="space-y-2 border-t border-white/5 pt-4">
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
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


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
      )}
      {filteredStaff.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 border border-white/5 rounded-2xl">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Staff Found</h3>
          <p className="text-slate-400">There are no staff members matching your criteria.</p>
        </div>
      )}

      <AnimatePresence>
      {deletingId && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-rose-500/10"
          >
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Staff Member?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to remove this staff member? This action cannot be undone and they will be removed from the website immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
              >
                Delete Staff
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
}

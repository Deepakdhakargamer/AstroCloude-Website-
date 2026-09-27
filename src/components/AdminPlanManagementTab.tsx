
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Plus, Server, CheckSquare, Square, Check, X, Copy, Trash2, Edit2, CheckCircle2, ChevronDown } from 'lucide-react';
import { AdminHostingPlan, AdminCategory } from '../types';
import { updateStoredPlans } from '../utils/planSync';
import { formatINR } from '../utils/currency';

interface AdminPlanManagementTabProps {
  plans: AdminHostingPlan[];
  categories: AdminCategory[];
  setPlans: (plans: AdminHostingPlan[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  setIsPlanEditorOpen: (open: boolean) => void;
  setEditingPlan: (plan: AdminHostingPlan | undefined) => void;
}

export function AdminPlanManagementTab({
  plans,
  categories,
  setPlans,
  onShowToast,
  setIsPlanEditorOpen,
  setEditingPlan
}: AdminPlanManagementTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ open: boolean; planIds: string[] }>({ open: false, planIds: [] });

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (plan.description && plan.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || plan.categoryId === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [plans, searchQuery, statusFilter, categoryFilter]);

  const toggleSelectAll = () => {
    if (selectedPlans.size === filteredPlans.length && filteredPlans.length > 0) {
      setSelectedPlans(new Set());
    } else {
      setSelectedPlans(new Set(filteredPlans.map(p => p.id)));
    }
  };

  const toggleSelectPlan = (id: string) => {
    const newSelected = new Set(selectedPlans);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPlans(newSelected);
  };

  const updatePlans = (newPlans: AdminHostingPlan[]) => {
    setPlans(newPlans);
    updateStoredPlans(newPlans);
  };

  const handleDeletePlans = () => {
    const newPlans = plans.filter(p => !deleteConfirmModal.planIds.includes(p.id));
    updatePlans(newPlans);
    setSelectedPlans(new Set());
    setDeleteConfirmModal({ open: false, planIds: [] });
    onShowToast(`Successfully deleted ${deleteConfirmModal.planIds.length} plan(s).`, 'success');
  };

  const handleDuplicatePlan = (plan: AdminHostingPlan) => {
    const duplicatedPlan: AdminHostingPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Copy)`,
      status: 'draft',
      order: plans.length + 1
    };
    updatePlans([...plans, duplicatedPlan]);
    onShowToast(`Plan duplicated successfully as Draft.`, 'success');
  };

  const handleBulkStatusChange = (status: 'active' | 'hidden' | 'draft') => {
    const newPlans = plans.map(p => {
      if (selectedPlans.has(p.id)) {
        return { ...p, status };
      }
      return p;
    });
    updatePlans(newPlans);
    onShowToast(`Updated status for ${selectedPlans.size} plan(s).`, 'success');
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Unknown Category';
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search hosting plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="disabled">Disabled</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={() => {
            setEditingPlan(undefined);
            setIsPlanEditorOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 whitespace-nowrap transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plan</span>
        </button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPlans.size > 0 && (
        <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-purple-300 ml-2">
              {selectedPlans.size} plan(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Publish
            </button>
            <button
              onClick={() => handleBulkStatusChange('draft')}
              className="px-3 py-1.5 rounded-lg bg-slate-500/20 text-slate-300 hover:bg-slate-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Draft
            </button>
            <button
              onClick={() => handleBulkStatusChange('hidden')}
              className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Disable
            </button>
            <button
              onClick={() => setDeleteConfirmModal({ open: true, planIds: Array.from(selectedPlans) })}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Plans List */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-16 bg-slate-950/50 border border-white/5 rounded-3xl">
          <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/50">
            <Server className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Plans Found</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' 
              ? "We couldn't find any plans matching your filters." 
              : "You haven't created any hosting plans yet."}
          </p>
          {!(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setEditingPlan(undefined);
                setIsPlanEditorOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-bold text-white shadow-lg shadow-purple-600/30 inline-flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Plan</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded-xl bg-slate-950/50">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-4 w-12">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white transition-colors">
                    {selectedPlans.size === filteredPlans.length && filteredPlans.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-purple-500" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-semibold">Plan Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Badge</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPlans.map(plan => {
                const isSelected = selectedPlans.has(plan.id);
                return (
                  <tr key={plan.id} className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-purple-500/5' : ''}`}>
                    <td className="p-4">
                      <button onClick={() => toggleSelectPlan(plan.id)} className="text-slate-400 hover:text-white transition-colors">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                          {plan.icon ? (
                            <img src={plan.icon} alt={plan.name} className="w-6 h-6 object-contain" />
                          ) : (
                            <Server className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {plan.name}
                            {plan.featured && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-md uppercase font-bold">Featured</span>}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">{plan.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-white/5 whitespace-nowrap">
                        {getCategoryName(plan.categoryId)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{formatINR(plan.price)}<span className="text-slate-500 text-xs">/{plan.billingCycle || 'mo'}</span></div>
                    </td>
                    <td className="p-4">
                      {plan.status === 'active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Active</span>}
                      {plan.status === 'draft' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-lg text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Draft</span>}
                      {plan.status === 'hidden' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div> Disabled</span>}
                    </td>
                    <td className="p-4">
                      {plan.badge ? (
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20 text-xs font-bold whitespace-nowrap">
                          {plan.badge}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDuplicatePlan(plan)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors tooltip-trigger"
                          title="Duplicate Plan"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPlan(plan);
                            setIsPlanEditorOpen(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors tooltip-trigger"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmModal({ open: true, planIds: [plan.id] })}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors tooltip-trigger"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
      {deleteConfirmModal.open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Delete Plan{deleteConfirmModal.planIds.length > 1 ? 's' : ''}?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete {deleteConfirmModal.planIds.length > 1 ? `these ${deleteConfirmModal.planIds.length} plans` : 'this plan'}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmModal({ open: false, planIds: [] })}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlans}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 transition-colors"
                >
                  Yes, Delete {deleteConfirmModal.planIds.length > 1 ? 'Plans' : 'Plan'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

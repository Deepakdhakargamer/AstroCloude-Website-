import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Save, Upload, Plus, Trash2, CheckCircle2, 
  ChevronRight, Server, Cpu, Image as ImageIcon, 
  Sparkles, LayoutList, Layers, Eye, Copy, RefreshCw, GripVertical, Settings, AlignLeft
, ChevronDown} from "lucide-react";
import { AdminHostingPlan, AdminCategory } from '../types';
import { formatINR } from '../utils/currency';
import { compressImageFile } from '../utils/imageCompress';

interface AdminPlanEditorProps {
  plan?: AdminHostingPlan;
  categories: AdminCategory[];
  onSave: (plan: AdminHostingPlan) => void;
  onAutoSave?: (plan: AdminHostingPlan) => void;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: LayoutList },
  { id: 'media', label: 'Images & Media', icon: ImageIcon },
  { id: 'specs', label: 'Specifications', icon: Cpu },
  { id: 'features', label: 'Features', icon: Sparkles },
  { id: 'display', label: 'Display & Settings', icon: Settings },
  { id: 'seo', label: 'SEO', icon: AlignLeft }
];

export function AdminPlanEditor({ plan, categories, onSave, onAutoSave, onClose, onShowToast }: AdminPlanEditorProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Basic Information
  const [name, setName] = useState(plan?.name || '');
  const [categoryId, setCategoryId] = useState(plan?.categoryId || '');
  const [description, setDescription] = useState(plan?.description || '');
  const [fullDescription, setFullDescription] = useState(plan?.fullDescription || '');
  const [price, setPrice] = useState(plan?.price?.toString() || '0');
  
  // Media
  const [logo, setLogo] = useState(plan?.logo || '');
  const [bannerImage, setBannerImage] = useState(plan?.bannerImage || '');
  const [footerImage, setFooterImage] = useState(plan?.footerImage || '');
  
  // Specs
  const initialSpecs = plan?.customSpecs ? [...plan.customSpecs] : [];
  if (initialSpecs.length === 0 && plan) {
    if (plan.cpu) initialSpecs.push({ label: 'CPU Spec', value: plan.cpu });
    if (plan.ram) initialSpecs.push({ label: 'Memory', value: plan.ram });
    if (plan.storage) initialSpecs.push({ label: 'Storage', value: plan.storage });
    if (plan.bandwidth) initialSpecs.push({ label: 'Bandwidth', value: plan.bandwidth });
    if (plan.network) initialSpecs.push({ label: 'Network', value: plan.network });
    if (plan.ddos) initialSpecs.push({ label: 'DDoS', value: plan.ddos });
  }
  const [specs, setSpecs] = useState<{label: string; value: string}[]>(initialSpecs.length ? initialSpecs : [{ label: '', value: '' }]);

  // Features
  const [features, setFeatures] = useState<string[]>(plan?.features?.length ? [...plan.features] : ['']);

  // Display Settings
  const [badge, setBadge] = useState<any>(plan?.badge || '');
  const [buttonText, setButtonText] = useState(plan?.buttonText || 'Buy Now');
  const [buttonLink, setButtonLink] = useState(plan?.buttonLink || '#contact');
  const [footerText, setFooterText] = useState(plan?.footerText || '');
  const [featured, setFeatured] = useState(plan?.featured || false);
  const [status, setStatus] = useState(plan?.status || 'draft');
  const [order, setOrder] = useState(plan?.order || 1);

  // SEO
  const [seoTitle, setSeoTitle] = useState(plan?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(plan?.seoDescription || '');

  // Form Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Plan Name is required';
    if (!categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPlanData = (): AdminHostingPlan => {
    return {
      id: plan?.id || 'plan-' + Date.now(),
      name,
      categoryId,
      description,
      fullDescription,
      price: parseFloat(price) || 0,
      badge,
      buttonText,
      buttonLink,
      featured,
      status: status as 'active' | 'hidden' | 'draft',
      order,
      logo,
      bannerImage,
      footerImage,
      footerText,
      features: features.filter(f => f.trim() !== ''),
      customSpecs: specs.filter(s => s.label.trim() !== '' && s.value.trim() !== ''),
      seoTitle,
      seoDescription,
      // Legacy fields mapping for backwards compatibility
      cpu: specs.find(s => /cpu|processor|core/i.test(s.label))?.value || plan?.cpu || '',
      ram: specs.find(s => /memory|ram/i.test(s.label))?.value || plan?.ram || '',
      storage: specs.find(s => /storage|disk|nvme|ssd/i.test(s.label))?.value || plan?.storage || (plan as any)?.disk || '',
      disk: specs.find(s => /storage|disk|nvme|ssd/i.test(s.label))?.value || plan?.storage || (plan as any)?.disk || '',
      bandwidth: specs.find(s => /bandwidth|traffic/i.test(s.label))?.value || plan?.bandwidth || '',
      network: specs.find(s => /network|uplink|port/i.test(s.label))?.value || plan?.network || '',
      ddos: specs.find(s => /ddos|mitigation/i.test(s.label))?.value || plan?.ddos || '',
    };
  };

  // Auto Save
  useEffect(() => {
    if (!onAutoSave || !name || !categoryId) return;
    const timer = setTimeout(() => {
      setAutoSaveStatus('saving');
      onAutoSave(getPlanData());
      setTimeout(() => setAutoSaveStatus('saved'), 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [name, categoryId, description, fullDescription, price, badge, buttonText, buttonLink, featured, status, order, logo, bannerImage, footerImage, footerText, features, specs, seoTitle, seoDescription]);

  const handleSave = () => {
    if (!validate()) {
      onShowToast('Please fix the errors before saving', 'error');
      // Switch to first tab with error
      if (errors.name || errors.categoryId) setActiveTab('basic');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      onSave(getPlanData());
      setIsSaving(false);
    }, 600); // Simulate network delay for UX
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        onShowToast('File size must be less than 10MB', 'error');
        return;
      }
      try {
        const compressed = await compressImageFile(file, 800, 800, 0.82);
        setter(compressed);
        onShowToast('Image optimized & uploaded', 'info');
      } catch {
        onShowToast('Failed to process image file', 'error');
      }
    }
  };

  const handleDrop = async (e: React.DragEvent, setter: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        onShowToast('File size must be less than 10MB', 'error');
        return;
      }
      try {
        const compressed = await compressImageFile(file, 800, 800, 0.82);
        setter(compressed);
        onShowToast('Image optimized & uploaded', 'info');
      } catch {
        onShowToast('Failed to process image file', 'error');
      }
    }
  };

  const currentCategory = categories.find(c => c.id === categoryId);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-6xl max-h-[95vh] bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl shadow-black/50 flex flex-col overflow-hidden ring-1 ring-white/5"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-slate-950/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-inner">
              <Server className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-slate-400">Configure plan limits, styling, and features.</p>
                {onAutoSave && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    autoSaveStatus === 'saving' ? 'bg-amber-500/20 text-amber-400' : 
                    autoSaveStatus === 'saved' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'
                  }`}>
                    {autoSaveStatus === 'saving' ? 'Saving...' : autoSaveStatus === 'saved' ? 'Auto-saved' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                showPreview ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {showPreview ? <LayoutList className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPreview ? 'Back to Editor' : 'Live Preview'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar Tabs */}
          {!showPreview && (
            <div className="w-56 border-r border-white/5 bg-slate-950/20 p-4 shrink-0 overflow-y-auto">
              <nav className="space-y-1.5">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-inner' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </div>
                    {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-900/40 relative">
            {showPreview ? (
              <div className="flex justify-center items-start h-full pt-8">
                {/* Live Preview Card */}
                <div className="w-full max-w-sm">
                  <div className={`relative bg-slate-900/80 border rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl flex flex-col group ${
                    featured ? 'border-purple-500/60 shadow-purple-950/60' : 'border-white/10'
                  }`}>
                    {bannerImage && (
                      <div className="absolute inset-0 z-0">
                        <img src={bannerImage} alt="" className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/90 to-slate-950"></div>
                      </div>
                    )}
                    {badge && (
                      <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] uppercase tracking-widest font-extrabold px-3.5 py-1 rounded-full shadow-lg z-20">
                        {badge}
                      </div>
                    )}
                    <div className="p-7 flex flex-col flex-1 relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        {logo ? (
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 p-2 flex items-center justify-center">
                            <img src={logo} alt={name} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 border border-purple-500/30 px-3 py-1 rounded-lg">
                            {currentCategory?.name?.toUpperCase() || 'HOSTING'}
                          </span>
                        )}
                        <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                          {formatINR(parseFloat(price) || 0)}/mo
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">{name || 'Plan Title'}</h3>
                      {description && <p className="text-sm text-slate-400 mb-6">{description}</p>}
                      
                      <div className="space-y-3 mb-6">
                        {specs.slice(0, 4).map((spec, idx) => spec.label && spec.value && (
                          <div key={idx} className="flex items-center gap-3 text-slate-200 border-b border-white/5 pb-2 text-xs">
                            <span className="text-slate-400 w-24 shrink-0">{spec.label}:</span>
                            <span className="font-semibold text-white truncate">{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg mt-auto">
                        {buttonText || 'Buy Now'}
                      </button>
                      {footerText && (
                        <p className="text-[10px] text-slate-500 text-center mt-3 font-medium">{footerText}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <AnimatePresence mode="wait">
                  {/* BASIC INFO */}
                  {activeTab === 'basic' && (
                    <motion.div 
                      key="basic"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Plan Title <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({...errors, name: ''});
                              }}
                              placeholder="e.g. Obsidian Pro Node"
                              className={`w-full bg-slate-900 border ${errors.name ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all`}
                            />
                            {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Category Assignment <span className="text-rose-500">*</span></label>
                            <div className="relative">
<select
                              value={categoryId}
                              onChange={(e) => {
                                setCategoryId(e.target.value);
                                if (errors.categoryId) setErrors({...errors, categoryId: ''});
                              }}
                              className={`w-full bg-slate-900 border ${errors.categoryId ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all`}
                            >
                              <option value="" disabled>Select a Category...</option>
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
<ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
</div>
                            {errors.categoryId && <p className="text-rose-400 text-xs mt-1">{errors.categoryId}</p>}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-xs font-semibold text-slate-300 mb-2">Short Description</label>
                          <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A brief catchy description for the plan card"
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                          />
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-xs font-semibold text-slate-300 mb-2">Full Description (HTML Supported)</label>
                          <textarea
                            value={fullDescription}
                            onChange={(e) => setFullDescription(e.target.value)}
                            rows={4}
                            placeholder="Detailed explanation of what this plan offers. Used on dedicated plan pages."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all resize-y"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-2">Monthly Price (INR - ₹)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400 font-semibold">₹</span>
                            <input
                              type="number"
                              step="1"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* IMAGES & MEDIA */}
                  {activeTab === 'media' && (
                    <motion.div 
                      key="media"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Images & Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Logo Upload */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-3">Plan Logo / Icon</label>
                            <div 
                              className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-6 text-center transition-all bg-slate-900/50 hover:bg-slate-900 group relative"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleDrop(e, setLogo)}
                            >
                              {logo ? (
                                <div className="relative inline-block w-full">
                                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 inline-block mb-3">
                                    <img src={logo} alt="Logo Preview" className="h-16 object-contain mx-auto" />
                                  </div>
                                  <div>
                                    <button onClick={() => setLogo('')} className="px-4 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-semibold transition-colors">
                                      Remove Image
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400">
                                    <Upload className="w-6 h-6" />
                                  </div>
                                  <p className="text-sm font-medium text-slate-200 mb-1">Upload Logo</p>
                                  <p className="text-xs text-slate-500 mb-4">Drag and drop or click to browse</p>
                                  <label className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-white/10 hover:border-white/20">
                                    Browse Files
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setLogo)} />
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Banner Upload */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-3">Card Background Banner</label>
                            <div 
                              className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-6 text-center transition-all bg-slate-900/50 hover:bg-slate-900 group relative"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleDrop(e, setBannerImage)}
                            >
                              {bannerImage ? (
                                <div className="relative inline-block w-full">
                                  <div className="w-full h-24 rounded-xl overflow-hidden border border-white/5 mb-3 relative">
                                    <img src={bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80"></div>
                                  </div>
                                  <div>
                                    <button onClick={() => setBannerImage('')} className="px-4 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-semibold transition-colors">
                                      Remove Banner
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                  <p className="text-sm font-medium text-slate-200 mb-1">Upload Banner</p>
                                  <p className="text-xs text-slate-500 mb-4">Recommended size: 800x400px</p>
                                  <label className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-white/10 hover:border-white/20">
                                    Browse Files
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setBannerImage)} />
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SPECIFICATIONS */}
                  {activeTab === 'specs' && (
                    <motion.div 
                      key="specs"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-bold text-white">Custom Specifications</h3>
                            <p className="text-xs text-slate-400 mt-1">Define key-value pairs for technical specs (CPU, RAM, etc.)</p>
                          </div>
                          <button 
                            onClick={() => setSpecs([...specs, { label: '', value: '' }])}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors text-xs font-bold border border-purple-500/30"
                          >
                            <Plus className="w-4 h-4" />
                            Add Row
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {specs.map((spec, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-white/5 group">
                              <div className="cursor-grab p-2 text-slate-600 hover:text-slate-400">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                value={spec.label}
                                onChange={(e) => {
                                  const newSpecs = [...specs];
                                  newSpecs[index].label = e.target.value;
                                  setSpecs(newSpecs);
                                }}
                                placeholder="Label (e.g. Memory)"
                                className="w-full sm:w-1/3 bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                              />
                              <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => {
                                  const newSpecs = [...specs];
                                  newSpecs[index].value = e.target.value;
                                  setSpecs(newSpecs);
                                }}
                                placeholder="Value (e.g. 16 GB DDR5)"
                                className="w-full sm:flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-semibold text-purple-200 focus:outline-none focus:border-purple-500/50"
                              />
                              <button 
                                onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                                className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {specs.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm">
                              No specifications added yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* FEATURES */}
                  {activeTab === 'features' && (
                    <motion.div 
                      key="features"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-bold text-white">Feature List</h3>
                            <p className="text-xs text-slate-400 mt-1">Add bullet points highlighting the main benefits.</p>
                          </div>
                          <button 
                            onClick={() => setFeatures([...features, ''])}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors text-xs font-bold border border-purple-500/30"
                          >
                            <Plus className="w-4 h-4" />
                            Add Feature
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {features.map((feat, index) => (
                            <div key={index} className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-white/5 group">
                              <div className="cursor-grab p-2 text-slate-600 hover:text-slate-400">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              </div>
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => {
                                  const newF = [...features];
                                  newF[index] = e.target.value;
                                  setFeatures(newF);
                                }}
                                placeholder="e.g. Unlimited Free Daily Backups"
                                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                              />
                              <button 
                                onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                                className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {features.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm">
                              No features added yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* DISPLAY & SETTINGS */}
                  {activeTab === 'display' && (
                    <motion.div 
                      key="display"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Display & Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Plan Status</label>
                            <div className="relative">
<select
                              value={status}
                              onChange={(e) => setStatus(e.target.value as any)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                            >
                              <option value="draft">Draft (Hidden)</option>
                              <option value="active">Published (Active)</option>
                              <option value="hidden">Hidden (Archived)</option>
                            </select>
<ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
</div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Sort Order</label>
                            <input
                              type="number"
                              value={order}
                              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Marketing Badge</label>
                            <div className="relative">
<select
                              value={badge}
                              onChange={(e) => setBadge(e.target.value as any)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                            >
                              <option value="">None</option>
                              <option value="New">New</option>
                              <option value="Popular">Popular</option>
                              <option value="Premium">Premium</option>
                              <option value="Recommended">Recommended</option>
                              <option value="Limited">Limited Time</option>
                            </select>
<ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Button Text</label>
                            <input
                              type="text"
                              value={buttonText}
                              onChange={(e) => setButtonText(e.target.value)}
                              placeholder="e.g. Get Started"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Button Link / Action</label>
                            <input
                              type="text"
                              value={buttonLink}
                              onChange={(e) => setButtonLink(e.target.value)}
                              placeholder="e.g. /checkout or #contact"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-900/80 border border-white/5 rounded-xl p-5 mb-2">
                          <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="peer sr-only"
                              />
                              <div className="w-12 h-6 bg-slate-800 rounded-full peer-checked:bg-purple-600 transition-colors border border-white/5"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6 shadow-sm"></div>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-white mb-0.5">Highlight as Featured Plan</div>
                              <div className="text-xs text-slate-400">Applies premium glowing borders and makes it stand out among others.</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SEO */}
                  {activeTab === 'seo' && (
                    <motion.div 
                      key="seo"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Search Engine Optimization</h3>
                        
                        <div className="mb-6">
                          <label className="block text-xs font-semibold text-slate-300 mb-2">SEO Title Tag</label>
                          <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder={name ? `${name} Hosting` : "e.g. High Performance Minecraft Hosting"}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">Recommended length: 50-60 characters</p>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-2">SEO Meta Description</label>
                          <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={3}
                            placeholder={description || "Discover our premium hosting solutions..."}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">Recommended length: 150-160 characters</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!showPreview && activeTab !== 'basic' && (
              <button 
                onClick={() => {
                  const currentIndex = TABS.findIndex(t => t.id === activeTab);
                  if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1].id);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
              >
                Previous Step
              </button>
            )}
            {!showPreview && activeTab !== 'seo' && (
              <button 
                onClick={() => {
                  const currentIndex = TABS.findIndex(t => t.id === activeTab);
                  if (currentIndex < TABS.length - 1) setActiveTab(TABS[currentIndex + 1].id);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
              >
                Next Step
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="relative flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 overflow-hidden"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{status === 'draft' ? 'Save Draft' : 'Save & Publish'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

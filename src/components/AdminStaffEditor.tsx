import React, { useState, useRef } from 'react';
import { AdminStaff, AdminRole } from '../types';
import { Upload, X, Save, ArrowLeft, Image as ImageIcon, Github, Twitter, Youtube, Instagram, Globe, MessageSquare, ShieldAlert , ChevronDown} from "lucide-react";
import { compressImageFile } from '../utils/imageCompress';

interface AdminStaffEditorProps {
  staff?: AdminStaff;
  roles?: AdminRole[];
  onSave: (staff: AdminStaff) => void;
  onCancel: () => void;
}

export function AdminStaffEditor({ staff, roles = [], onSave, onCancel }: AdminStaffEditorProps) {
  const [formData, setFormData] = useState<Partial<AdminStaff>>(
    staff || {
      id: `staff-${Date.now()}`,
      name: '',
      username: '',
      role: 'Support',
      shortBio: '',
      fullDescription: '',
      profileImage: '',
      discordUsername: '',
      discordUserId: '',
      discordProfileLink: '',
      email: '',
      badgeColor: '#a855f7',
      socialLinks: { discord: '', github: '', youtube: '', twitter: '', instagram: '', website: '' },
      order: 0,
      featured: false,
      status: 'active'
    }
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 800, 800, 0.82);
        setFormData(prev => ({ ...prev, backgroundImage: compressed }));
      } catch {
        // Fallback
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, backgroundImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 400, 400, 0.82);
        setFormData(prev => ({ ...prev, profileImage: compressed }));
      } catch {
        // Fallback
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...(formData.socialLinks || {}),
        [platform]: value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (!finalData.dateAdded) {
      finalData.dateAdded = new Date().toISOString().split('T')[0];
    }
    onSave(finalData as AdminStaff);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-30 opacity-5 pointer-events-none">
        <ImageIcon className="w-96 h-96" />
      </div>
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">{staff ? 'Edit Staff Member' : 'Add New Staff'}</h2>
          <p className="text-sm text-slate-400">Manage staff profile and permissions</p>
        </div>
      </div>

      
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
        <div className="max-w-sm mx-auto bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm relative">
          <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 relative">
            {formData.backgroundImage ? (
              <img src={formData.backgroundImage} alt="bg" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
            ) : (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            )}
            {formData.featured && (
              <div className="absolute top-4 right-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Featured
              </div>
            )}
          </div>
          <div className="px-6 pb-6 pt-0 relative">
            <div className="-mt-12 mb-4">
              <img
                src={formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'A')}&background=random`}
                alt={formData.name}
                className="w-24 h-24 rounded-2xl border-4 border-slate-950 object-cover bg-slate-800 shadow-xl"
              />
            </div>
            <h4 className="text-xl font-bold text-white mb-1">{formData.name || 'Staff Name'}</h4>
            <p className="text-sm text-slate-400 mb-4">@{formData.username || 'username'}</p>
            <div className="mb-4">
              <span 
                className="inline-block px-3 py-1 rounded-lg text-xs font-bold border"
                style={{ 
                  backgroundColor: `${formData.badgeColor}15`, 
                  color: formData.badgeColor,
                  borderColor: `${formData.badgeColor}30` 
                }}
              >
                {formData.role === 'Custom Role' ? (formData.customRoleName || 'Custom Role') : formData.role}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3">
              {formData.shortBio || 'Staff bio will appear here.'}
            </p>
            <div className="space-y-4">
              {formData.discordUsername && (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/50 p-2 rounded-xl border border-white/5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  {formData.discordUsername}
                </div>
              )}
              {formData.socialLinks && Object.values(formData.socialLinks).some(val => val) && (
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  {formData.socialLinks.twitter && <Twitter className="w-4 h-4 text-slate-500" />}
                  {formData.socialLinks.github && <Github className="w-4 h-4 text-slate-500" />}
                  {formData.socialLinks.youtube && <Youtube className="w-4 h-4 text-slate-500" />}
                  {formData.socialLinks.instagram && <Instagram className="w-4 h-4 text-slate-500" />}
                  {formData.socialLinks.website && <Globe className="w-4 h-4 text-slate-500" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value="Owner">Owner</option>
                  <option value="Co-Owner">Co-Owner</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Support">Support</option>
                  {roles.map(r => {
                    if (!['Owner', 'Co-Owner', 'Administrator', 'Developer', 'Manager', 'Moderator', 'Support'].includes(r.name)) {
                      return <option key={r.id} value={r.name}>{r.name}</option>;
                    }
                    return null;
                  })}
                  <option value="Custom Role">Custom Role</option>
                </select>
              </div>
              {formData.role === 'Custom Role' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Custom Role Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customRoleName || ''}
                    onChange={e => setFormData({ ...formData, customRoleName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="e.g. Marketing Lead"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Short Bio</label>
              <input
                type="text"
                required
                value={formData.shortBio}
                onChange={e => setFormData({ ...formData, shortBio: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="A brief description of this staff member"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Full Description</label>
              <textarea
                required
                value={formData.fullDescription}
                onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 h-32 resize-none"
                placeholder="Detailed background and information..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Badge Color</label>
                <div className="flex items-center gap-3 bg-slate-950 border border-white/10 rounded-xl px-4 py-2">
                  <input
                    type="color"
                    value={formData.badgeColor}
                    onChange={e => setFormData({ ...formData, badgeColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={formData.badgeColor}
                    onChange={e => setFormData({ ...formData, badgeColor: e.target.value })}
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
                        <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Background Image</h3>
              <div className="flex flex-col items-center text-center">
                <div className="relative group w-full h-32 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-white/20 mb-4">
                  {formData.backgroundImage ? (
                    <>
                      <img src={formData.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, backgroundImage: '' })}
                          className="p-2 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500/40"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => bgInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-xs">Upload Background</span>
                    </button>
                  )}
                </div>
                <input
                  ref={bgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Profile Image</h3>
              <div className="flex flex-col items-center text-center">
                <div className="relative group w-32 h-32 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-white/20 mb-4">
                  {formData.profileImage ? (
                    <>
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, profileImage: '' })}
                          className="p-2 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500/40"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-xs">Upload</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-[10px] text-slate-400">Recommended size: 400x400px. Max size: 2MB.</p>
              </div>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Discord Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Discord Username</label>
                  <input
                    type="text"
                    required
                    value={formData.discordUsername}
                    onChange={e => setFormData({ ...formData, discordUsername: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    placeholder="User#1234 or user"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Discord User ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.discordUserId || ''}
                    onChange={e => setFormData({ ...formData, discordUserId: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    placeholder="123456789012345678"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Display Settings</h3>
              
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-semibold text-slate-300">Featured Staff</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${formData.featured ? 'bg-purple-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-semibold text-slate-300">Status</label>
                <div className="relative">
<select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="bg-slate-900 border border-white/10 rounded-lg pl-4 pr-10 py-3 py-1.5 text-xs text-white focus:border-purple-500 outline-none appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                </select>
<ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['twitter', 'github', 'youtube', 'instagram', 'website'].map(platform => (
              <div key={platform}>
                <label className="block text-xs text-slate-400 mb-1 capitalize">{platform === 'twitter' ? 'X (Twitter)' : platform}</label>
                <input
                  type="url"
                  value={formData.socialLinks?.[platform as keyof typeof formData.socialLinks] || ''}
                  onChange={e => handleSocialChange(platform, e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Staff Member
          </button>
        </div>
      </form>
    </div>
  );
}

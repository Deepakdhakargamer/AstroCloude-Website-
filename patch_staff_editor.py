import re

with open("src/components/AdminStaffEditor.tsx", "r") as f:
    content = f.read()

# Add ref for bg upload
content = content.replace("const fileInputRef = useRef<HTMLInputElement>(null);",
"""const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);""")

# Add handleBgUpload function
content = content.replace("const handleImageUpload",
"""const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload""")

# Add bg image upload UI before profile image
bg_ui = """            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
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
            </div>"""

content = content.replace('<div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">\n              <h3 className="text-sm font-bold text-white mb-4">Profile Image</h3>', bg_ui + '\n\n            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">\n              <h3 className="text-sm font-bold text-white mb-4">Profile Image</h3>')

# Add Live Preview UI at the top
imports = """import { Upload, X, Save, ArrowLeft, Image as ImageIcon, Github, Twitter, Youtube, Instagram, Globe, MessageSquare, ShieldAlert } from 'lucide-react';"""
content = re.sub(r"import { Upload, X, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';", imports, content)

preview_ui = """
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
"""

content = content.replace('<form onSubmit={handleSubmit} className="space-y-8 relative z-10">', preview_ui + '\n      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">')

with open("src/components/AdminStaffEditor.tsx", "w") as f:
    f.write(content)
print("Patched AdminStaffEditor")

import re

with open("src/components/UserDashboard.tsx", "r") as f:
    text = f.read()

# 1. Remove the button
old_button = """              <button
                onClick={() => setActiveTab('theme')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'theme'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Theme & Appearance</span>
              </button>"""
text = text.replace(old_button, "")

# 2. Update the header title text
old_h1 = """              {activeTab === 'profile' ? 'Profile Management' : activeTab === 'tickets' ? 'Support Tickets' : activeTab === 'orders' ? 'Billing & Invoices' : 'Theme & Appearance'}"""
new_h1 = """              {activeTab === 'profile' ? 'Profile Management' : activeTab === 'tickets' ? 'Support Tickets' : activeTab === 'orders' ? 'Billing & Invoices' : ''}"""
text = text.replace(old_h1, new_h1)

# 3. Update the header subtitle
old_p = """              {activeTab === 'profile' 
                ? 'Update your personal credentials, security keys, and account preferences.'
                : activeTab === 'tickets'
                ? 'Submit issues and track your ongoing support requests.'
                : activeTab === 'orders'
                ? 'Manage your subscriptions and download past invoices.'
                : 'Customize your dashboard visual theme, accent colors, and display mode.'}"""
new_p = """              {activeTab === 'profile' 
                ? 'Update your personal credentials, security keys, and account preferences.'
                : activeTab === 'tickets'
                ? 'Submit issues and track your ongoing support requests.'
                : activeTab === 'orders'
                ? 'Manage your subscriptions and download past invoices.'
                : ''}"""
text = text.replace(old_p, new_p)

# 4. Remove the block rendering the activeTab === 'theme' content
old_theme_block = """        {/* TAB 2: THEME & APPEARANCE */}
        {activeTab === 'theme' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-6"
          >
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Theme & Interface Appearance
              </h3>

              <form onSubmit={handleSaveTheme} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-3">Color Scheme Preset</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'neon-purple', name: 'Neon Purple (Default)', desc: 'Deep cosmic slate with vibrant violet gradients', color: '#8b5cf6' },
                      { id: 'obsidian-black', name: 'Obsidian Black', desc: 'True dark minimalism with ultra-clean contrast', color: '#000000' },
                      { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Electric pink and purple high-impact glow', color: '#ec4899' },
                      { id: 'midnight-blue', name: 'Midnight Blue', desc: 'Deep oceanic blues with crisp cyan highlights', color: '#3b82f6' },
                    ].map(theme => (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id as any)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          selectedTheme === theme.id
                            ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/30'
                            : 'bg-slate-950 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full shrink-0 mt-0.5 border border-white/20" style={{ backgroundColor: theme.color }} />
                        <div>
                          <h4 className="text-xs font-bold text-white mb-1">{theme.name}</h4>
                          <p className="text-[11px] text-slate-400">{theme.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <label className="block text-xs font-semibold text-slate-300 mb-3">Accent Color</label>
                  <div className="flex items-center gap-3">
                    {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'].map(col => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setAccentColor(col)}
                        className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                          accentColor === col ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-white/10">
                    <div>
                      <h4 className="text-xs font-bold text-white">Compact Density Mode</h4>
                      <p className="text-[11px] text-slate-400">Reduce padding and spacing across tables and panels.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                      className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all"
                  >
                    Save Appearance
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}"""

text = text.replace(old_theme_block, "")

# Some block might not have the "        {/* TAB 2: THEME & APPEARANCE */}" prefix correctly if I guessed it wrong. Let me make sure it removes activeTab === 'theme' block.
# Let's just use regex for the whole block from activeTab === 'theme' to its closing.
import re
text = re.sub(r"\{\s*activeTab === 'theme' && \(\s*<motion\.div.*?</motion\.div>\s*\)\s*\}", "", text, flags=re.DOTALL)

with open("src/components/UserDashboard.tsx", "w") as f:
    f.write(text)

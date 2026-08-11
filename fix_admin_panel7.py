with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

broken_section = """                        {featureModalTab === 'settings' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Status</label>
                              <div className="relative">
                              <div className="relative"><select
                                value={featStatus}
                                onChange={(e) => setFeatStatus(e.target.value as any)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
                              >
                                <option value="active">Active (Visible on Homepage)</option>
                                <option value="disabled">Disabled (Hidden)</option>
                              </select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>
                            </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge Tag</label>
                              <input
                                type="text"
                                value={featBadge}
                                onChange={(e) => setFeatBadge(e.target.value)}
                                placeholder="e.g. Fast, NVMe, New"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Animation Effect</label>
                              <div className="relative"><select
                                value={featAnimation}
                                onChange={(e) => setFeatAnimation(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
                              >
                                <option value="fade-up">Fade Up</option>
                                <option value="zoom-in">Zoom In</option>
                                <option value="slide-in">Slide In</option>
                              </select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>
                            </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Color Theme</label>
                              <div className="relative"><select
                                value={featColorTheme}
                                onChange={(e) => setFeatColorTheme(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
                              >
                                <option value="slate">Slate Modern</option>
                                <option value="purple">Purple Glow</option>
                                <option value="emerald">Emerald Trust</option>
                              </select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>
                            </div>
                            </div>
                          </div>
                        </div>
                      )}"""

fixed_section = """                        {featureModalTab === 'settings' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Status</label>
                              <div className="relative">
                                <select
                                  value={featStatus}
                                  onChange={(e) => setFeatStatus(e.target.value as any)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
                                >
                                  <option value="active">Active (Visible on Homepage)</option>
                                  <option value="disabled">Disabled (Hidden)</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge Tag</label>
                              <input
                                type="text"
                                value={featBadge}
                                onChange={(e) => setFeatBadge(e.target.value)}
                                placeholder="e.g. Fast, NVMe, New"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Animation Effect</label>
                              <div className="relative">
                                <select
                                  value={featAnimation}
                                  onChange={(e) => setFeatAnimation(e.target.value)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
                                >
                                  <option value="fade-up">Fade Up</option>
                                  <option value="zoom-in">Zoom In</option>
                                  <option value="slide-in">Slide In</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Color Theme</label>
                              <div className="relative">
                                <select
                                  value={featColorTheme}
                                  onChange={(e) => setFeatColorTheme(e.target.value)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
                                >
                                  <option value="slate">Slate Modern</option>
                                  <option value="purple">Purple Glow</option>
                                  <option value="emerald">Emerald Trust</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}"""

content = content.replace(broken_section, fixed_section)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

print("fixed AdminPanel 7")

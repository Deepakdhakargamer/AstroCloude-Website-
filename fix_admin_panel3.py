with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

broken_block = """                              <div className="relative"><select
                                value={featColorTheme}
                                onChange={(e) => setFeatColorTheme(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
                              >
                                <option value="slate">Slate Modern</option>
                                <option value="purple">Purple Glow</option>
                                <option value="emerald">Emerald Trust</option>
                              </select><ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>
                              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            </div>"""
                            
fixed_block = """                              <div className="relative">
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
                            </div>"""

content = content.replace(broken_block, fixed_block)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

print("fixed AdminPanel 3")

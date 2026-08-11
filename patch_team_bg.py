with open("src/components/Team.tsx", "r") as f:
    content = f.read()

bg_ui = """                    <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                      {member.backgroundImage ? (
                        <img src={member.backgroundImage} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
                      ) : (
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                      )}
                      {member.featured && ("""

content = content.replace("""                    <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                      {member.featured && (""", bg_ui)

with open("src/components/Team.tsx", "w") as f:
    f.write(content)
print("Patched Team.tsx")

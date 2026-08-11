import re

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """className="fixed inset-0 z-50 pt-24 pb-24 bg-slate-950 overflow-y-auto\"""",
    """className="min-h-screen pt-24 pb-24 bg-slate-950 relative overflow-hidden\""""
)

# Replace closing </div> with </motion.div> for the main return
# We can find the last </div>
content = content.rsplit("</div>\n  );\n}", 1)
content = "</motion.div>\n  );\n}".join(content)

with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)

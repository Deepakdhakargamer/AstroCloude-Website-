import re

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

content = content.replace("</motion.div>", "")

# Replace the last `      </div>\n    </div>\n  );\n}` with `      </div>\n    </motion.div>\n  );\n}` 
# Or just find the last `</div>` before `);\n}`
content = re.sub(r'</div>\s*div>\s*\);\s*}', '</div></motion.div>);}', content)
# Wait, let's just use rsplit
parts = content.rsplit(");", 1)
parts[0] = parts[0].strip()
if parts[0].endswith("</div>"):
    parts[0] = parts[0][:-6] + "</motion.div>"
content = parts[0] + "\n  );\n}\n"

with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)

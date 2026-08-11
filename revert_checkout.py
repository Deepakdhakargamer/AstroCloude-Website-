with open("src/components/Checkout.tsx", "r") as f:
    text = f.read()

text = text.replace("import { motion } from 'motion/react';", "")
text = text.replace("<motion.div", "<div")
text = text.replace("</motion.div>", "</div>")
# remove motion props
import re
text = re.sub(r'initial=\{\{.*?\}\}', '', text, flags=re.DOTALL)
text = re.sub(r'animate=\{\{.*?\}\}', '', text, flags=re.DOTALL)
text = re.sub(r'exit=\{\{.*?\}\}', '', text, flags=re.DOTALL)
text = re.sub(r'transition=\{\{.*?\}\}', '', text, flags=re.DOTALL)

with open("src/components/Checkout.tsx", "w") as f:
    f.write(text)

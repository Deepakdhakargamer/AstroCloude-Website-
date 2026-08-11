with open("src/components/Checkout.tsx", "r") as f:
    text = f.read()

import re

# tokenize tags
tags = re.findall(r'</?(?:div|motion\.div)[^>]*>', text)
stack = []
for tag in tags:
    is_closing = tag.startswith('</')
    name = 'motion.div' if 'motion.div' in tag else 'div'
    if is_closing:
        if not stack:
            print("Extra closing:", tag)
        else:
            top = stack.pop()
            if top != name:
                print(f"Mismatch: expected </{top}>, found {tag}")
    else:
        stack.append(name)
        
for tag in stack:
    print("Unclosed:", tag)

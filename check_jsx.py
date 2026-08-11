import re
with open("src/components/Checkout.tsx", "r") as f:
    text = f.read()
# match all open and close tags
# simplified regex
tags = re.findall(r'</?[a-zA-Z0-9\.]+(?:\s+[^>]*)?/?>', text)
stack = []
void_elements = ["img", "input", "br", "hr", "meta", "link"]
for tag in tags:
    if tag.endswith('/>'): continue
    
    tag_name = re.match(r'</?([a-zA-Z0-9\.]+)', tag).group(1)
    if tag_name.lower() in void_elements: continue
    if tag_name == 'svg': continue # skip svg internals because they might be messy
    if tag_name in ['path', 'rect', 'circle', 'line']: continue
    
    is_closing = tag.startswith('</')
    if is_closing:
        if not stack:
            print("Extra closing:", tag)
        else:
            top = stack.pop()
            if top != tag_name:
                print(f"Mismatch: expected </{top}>, found {tag}")
                break
    else:
        stack.append(tag_name)

print("Remaining in stack:", stack)

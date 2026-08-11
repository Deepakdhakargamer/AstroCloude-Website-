with open("src/components/Navbar.tsx", "r") as f:
    content = f.read()

content = content.replace("            Request Plan\n", "            Buy Now\n")

with open("src/components/Navbar.tsx", "w") as f:
    f.write(content)

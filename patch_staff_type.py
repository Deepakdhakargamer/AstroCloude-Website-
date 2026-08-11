with open("src/types.ts", "r") as f:
    content = f.read()

content = content.replace(
    "profileImage: string;",
    "profileImage: string;\n  backgroundImage?: string;"
)

with open("src/types.ts", "w") as f:
    f.write(content)

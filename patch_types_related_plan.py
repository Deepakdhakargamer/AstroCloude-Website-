import re

with open("src/types.ts", "r") as f:
    content = f.read()

content = content.replace(
"  category: string;",
"  category: string;\n  relatedPlan?: string;"
)

with open("src/types.ts", "w") as f:
    f.write(content)
print("types updated")

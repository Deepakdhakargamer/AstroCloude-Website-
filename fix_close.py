with open("src/components/AdminTicketsTab.tsx", "r") as f:
    lines = f.read().splitlines()

# We need to insert a closing </div> before the last ");"
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == ");":
        lines.insert(i, "    </div>")
        break

with open("src/components/AdminTicketsTab.tsx", "w") as f:
    f.write("\n".join(lines) + "\n")
print("Fixed close")

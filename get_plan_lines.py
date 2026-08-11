with open("src/components/AdminPanel.tsx", "r") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "{/* 2. PLAN MANAGEMENT */}" in line:
        start_idx = i
    if "{/* 3. SUPPORT TICKETS */}" in line:
        end_idx = i

print(f"Starts at {start_idx}, ends at {end_idx}")

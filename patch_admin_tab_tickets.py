with open("src/components/AdminPanel.tsx", "r") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{/* 3. SUPPORT TICKETS */}" in line:
        start_idx = i
        break

if start_idx != -1:
    for i in range(start_idx + 1, len(lines)):
        if "{/* 4. USER MANAGEMENT */}" in lines[i]:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    new_code = """        {/* 3. SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <AdminTicketsTab 
            tickets={tickets} 
            onUpdate={updateTicketsAndSync} 
            onShowToast={onShowToast} 
          />
        )}
"""
    lines[start_idx:end_idx] = [new_code]
    with open("src/components/AdminPanel.tsx", "w") as f:
        f.writelines(lines)
    print("AdminPanel ticket tab patched successfully")
else:
    print("Could not find boundaries")

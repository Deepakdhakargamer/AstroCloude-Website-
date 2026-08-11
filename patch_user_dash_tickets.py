with open("src/components/UserDashboard.tsx", "r") as f:
    content = f.read()

to_replace = "{/* TAB 1: PROFILE */}"

new_code = """        {/* TAB 3: SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <UserTicketsTab 
            tickets={tickets.filter(t => t.userEmail === userEmail)}
            allTickets={tickets}
            userName={userName}
            userEmail={userEmail}
            onUpdate={updateTicketsAndSync}
            onShowToast={onShowToast}
          />
        )}

        {/* TAB 1: PROFILE */}"""

content = content.replace(to_replace, new_code)

with open("src/components/UserDashboard.tsx", "w") as f:
    f.write(content)
print("UserDashboard tickets patched")

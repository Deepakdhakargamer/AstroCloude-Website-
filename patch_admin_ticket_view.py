import re

with open("src/components/AdminTicketsTab.tsx", "r") as f:
    content = f.read()

to_replace = """              <span>Ticket #{activeTicket.id}</span>
              <span>•</span>
              <span>Category: {activeTicket.category}</span>
              <span>•</span>"""

new_code = """              <span>Ticket #{activeTicket.id}</span>
              <span>•</span>
              <span>Category: {activeTicket.category}</span>
              {activeTicket.relatedPlan && (
                <>
                  <span>•</span>
                  <span>Plan: {activeTicket.relatedPlan}</span>
                </>
              )}
              <span>•</span>"""

content = content.replace(to_replace, new_code)

with open("src/components/AdminTicketsTab.tsx", "w") as f:
    f.write(content)
print("AdminTicketsTab view updated")

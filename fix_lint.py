with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# Fix useEffect import
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

# Fix missing staff permission around 1977
to_replace = """                          permissions: {
                            categories: { view: true, create: false, edit: false, delete: false, manage: false },
                            plans: { view: true, create: false, edit: false, delete: false, manage: false },
                            tickets: { view: true, create: true, edit: true, delete: false, manage: true },
                            users: { view: false, create: false, edit: false, delete: false, manage: false },
                            roles: { view: false, create: false, edit: false, delete: false, manage: false },
                            settings: { view: false, create: false, edit: false, delete: false, manage: false }
                          }"""
new_code = """                          permissions: {
                            categories: { view: true, create: false, edit: false, delete: false, manage: false },
                            plans: { view: true, create: false, edit: false, delete: false, manage: false },
                            tickets: { view: true, create: true, edit: true, delete: false, manage: true },
                            users: { view: false, create: false, edit: false, delete: false, manage: false },
                            roles: { view: false, create: false, edit: false, delete: false, manage: false },
                            staff: { view: false, create: false, edit: false, delete: false, manage: false },
                            settings: { view: false, create: false, edit: false, delete: false, manage: false }
                          }"""

content = content.replace(to_replace, new_code)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)
print("Lint fixed")

import re
import os

def replace_in_file(filename, old_str, new_str):
    with open(filename, "r") as f:
        content = f.read()
    content = content.replace(old_str, new_str)
    with open(filename, "w") as f:
        f.write(content)

replace_in_file("src/components/CategoryPlans.tsx", "'Deploy Now'", "'Buy Now'")
replace_in_file("src/components/Services.tsx", "'Deploy Now'", "'Buy Now'")
replace_in_file("src/components/AdminPanel.tsx", "'Deploy Now'", "'Buy Now'")
replace_in_file("src/components/Plans.tsx", "'Request Plan Deployment'", "'Buy Now'")
replace_in_file("src/components/AdminPlanEditor.tsx", "'Request Plan'", "'Buy Now'")
replace_in_file("src/components/Navbar.tsx", ">Request Plan<", ">Buy Now<")

print("Done")

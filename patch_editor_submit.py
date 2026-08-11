import re

with open("src/components/AdminStaffEditor.tsx", "r") as f:
    content = f.read()

to_replace = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as AdminStaff);
  };"""

new_code = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (!finalData.dateAdded) {
      finalData.dateAdded = new Date().toISOString().split('T')[0];
    }
    onSave(finalData as AdminStaff);
  };"""

content = content.replace(to_replace, new_code)

with open("src/components/AdminStaffEditor.tsx", "w") as f:
    f.write(content)
print("Editor handleSubmit patched")

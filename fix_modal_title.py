with open("src/components/RequestPlanModal.tsx", "r") as f:
    content = f.read()

content = content.replace(">Request Plan Deployment<", ">Complete Purchase<")

with open("src/components/RequestPlanModal.tsx", "w") as f:
    f.write(content)

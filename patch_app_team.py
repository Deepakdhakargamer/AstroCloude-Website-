with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("import { Footer } from './components/Footer';", "import { Footer } from './components/Footer';\nimport { Team } from './components/Team';")

content = content.replace("<WhyChoose />", "<WhyChoose />\n          <Team />")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Team added to App.tsx")

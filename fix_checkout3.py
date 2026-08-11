with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()
content = content.replace("      </motion.div>\n  );\n}", "      </div>\n    </div>\n    </motion.div>\n  );\n}")
with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)

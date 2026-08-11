with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

content = content.replace(
"""      </div>
    </div>
      </div>
    </motion.div>
  );
}""",
"""      </div>
    </div>
      </div>
    </div>
    </motion.div>
  );
}"""
)
with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)

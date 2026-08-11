with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}""",
    """                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          )}"""
)
with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}""",
    """                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}"""
)
with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)

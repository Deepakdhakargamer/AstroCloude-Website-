import re

with open("src/components/AdminPanel.tsx", "r") as f:
    content = f.read()

# 1. Feature Modal
content = content.replace(
    """            {/* Comprehensive Feature Modal */}
              {featureModal.open && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">""",
    """            {/* Comprehensive Feature Modal */}
            <AnimatePresence>
              {featureModal.open && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">"""
)
content = content.replace(
    """                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}""",
    """                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>"""
)

# 2. Category Modal
content = content.replace(
    """            {/* Comprehensive Category Modal */}
            {categoryModal.open && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">""",
    """            {/* Comprehensive Category Modal */}
            <AnimatePresence>
            {categoryModal.open && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">"""
)

content = content.replace(
    """                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}""",
    """                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}"""
)


# 3. User Modal
content = content.replace(
    """            {/* User Modal */}
            {userModal.open && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">""",
    """            {/* User Modal */}
            <AnimatePresence>
            {userModal.open && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">"""
)

content = content.replace(
    """                      setUsers([...users, newU]);
                      onShowToast('New user account created successfully!', 'success');
                      setUserModal({ open: false });
                    }}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                  >
                    Create User
                  </button>
                </div>
              </div>
            </div>
          )}""",
    """                      setUsers([...users, newU]);
                      onShowToast('New user account created successfully!', 'success');
                      setUserModal({ open: false });
                    }}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                  >
                    Create User
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>"""
)

# 4. Role Modal
content = content.replace(
    """            {/* Role Modal */}
            {roleModal.open && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">""",
    """            {/* Role Modal */}
            <AnimatePresence>
            {roleModal.open && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">"""
)
content = content.replace(
    """                        setRoles([...roles, newR]);
                        onShowToast('New role created successfully!', 'success');
                        setRoleModal({ open: false });
                      }}
                      className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                    >
                      Create Role
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}""",
    """                        setRoles([...roles, newR]);
                        onShowToast('New role created successfully!', 'success');
                        setRoleModal({ open: false });
                      }}
                      className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                    >
                      Create Role
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}"""
)

# 5. Confirm Modal (already has motion.div for child, need to wrap in AnimatePresence and add motion to parent wrapper)
content = content.replace(
    """        {confirmModal && confirmModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >""",
    """        <AnimatePresence>
        {confirmModal && confirmModal.open && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >"""
)

content = content.replace(
    """                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}""",
    """                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}"""
)

# 6. Delete Category Modal
content = content.replace(
    """        {deleteCategoryModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >""",
    """        <AnimatePresence>
        {deleteCategoryModal.open && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >"""
)
content = content.replace(
    """                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {confirmModal""",
    """                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
        
        {confirmModal"""
)


with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(content)


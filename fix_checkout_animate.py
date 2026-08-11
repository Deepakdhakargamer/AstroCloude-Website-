import re

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

if "import { motion } from" not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { motion } from 'motion/react';")

# First return (no plan)
content = content.replace(
    """    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4">""",
    """    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4"
      >"""
)
content = content.replace(
    """        <button onClick={onBack} className="text-purple-400 hover:text-purple-300">Go Back</button>
      </div>
    );""",
    """        <button onClick={onBack} className="text-purple-400 hover:text-purple-300">Go Back</button>
      </motion.div>
    );"""
)

# Main return
content = content.replace(
    """  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-950 relative overflow-hidden">""",
    """  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 pt-24 pb-24 bg-slate-950 overflow-y-auto"
    >"""
)

# Replace the closing div. In this file, since we made it fixed inset-0, we should just change it back to motion.div
# Wait, let's just make it a motion.div without fixed inset-0 if it was already rendering as a separate view.
# Currently Checkout was just rendering inline (not fixed). Wait, if currentView is 'checkout', other things are unmounted!
# Oh right! In App.tsx:
#      {currentView === 'checkout' && (
#        <Checkout ... />
#      )}
# Wait, if we use `fixed inset-0`, it will cover everything. But we are replacing the view anyway.
# Let's not use `fixed inset-0 z-50`. Just the normal classes + motion.

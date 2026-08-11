with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

# Add motion import
if "import { motion } from 'motion/react';" not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { motion } from 'motion/react';")

content = content.replace(
    """  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-950 relative overflow-hidden">""",
    """  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-24 pb-24 bg-slate-950 relative overflow-hidden"
    >"""
)

# Fix the end tags correctly. Ensure there is only one </motion.div> for this container.
# Currently it might be `      </motion.div>\n  );\n}` at the end.
content = content.replace(
    """        </div>
      </motion.div>
  );
}""",
    """        </div>
      </motion.div>
  );
}"""
) # actually let's just make it end with </motion.div> replacing the last </div>
if content.endswith("    </motion.div>\n  );\n}\n"):
    pass
elif content.endswith("      </motion.div>\n  );\n}\n"):
    pass
elif content.endswith("      </div>\n  );\n}\n"):
    content = content.replace("      </div>\n  );\n}\n", "      </motion.div>\n  );\n}\n")
elif content.endswith("      </div>\n    </div>\n  );\n}\n"):
    content = content.replace("      </div>\n    </div>\n  );\n}\n", "      </div>\n    </motion.div>\n  );\n}\n")
else:
    # generic replace last </div>
    parts = content.rsplit("</div>", 1)
    if len(parts) == 2:
        content = "</motion.div>".join(parts)

with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)


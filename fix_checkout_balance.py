with open("src/components/Checkout.tsx", "r") as f:
    text = f.read()

import re

# We can just remove the last `</div>` before `</motion.div>`
text = text.replace("      </div>\n    </div>\n      </div>\n    </div>\n    </motion.div>", "      </div>\n    </div>\n      </div>\n    </motion.div>")

with open("src/components/Checkout.tsx", "w") as f:
    f.write(text)

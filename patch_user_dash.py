import re

with open("src/components/UserDashboard.tsx", "r") as f:
    content = f.read()

# Add activeTab state
content = content.replace("const [activeTab, setActiveTab] = useState<'profile' | 'theme'>('profile');",
"const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'tickets'>('profile');")

# Add icons
content = content.replace("import { User, Palette, Shield, Key, Bell, Sparkles, CheckCircle2, Sliders, Moon, Sun, Monitor } from 'lucide-react';",
"import { User, Palette, Shield, Key, Bell, Sparkles, CheckCircle2, Sliders, Moon, Sun, Monitor, Ticket, MessageSquare } from 'lucide-react';")

# Add Support Tickets to sidebar
sidebar_btn = """              <button
                onClick={() => setActiveTab('tickets')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Support Tickets</span>
              </button>"""
content = content.replace("<span>Theme & Appearance</span>\n              </button>", "<span>Theme & Appearance</span>\n              </button>\n" + sidebar_btn)

# Header Title
content = content.replace(
"""            <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">
              {activeTab === 'profile' ? 'Profile Management' : 'Theme & Appearance'}
            </h1>""",
"""            <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">
              {activeTab === 'profile' ? 'Profile Management' : activeTab === 'tickets' ? 'Support Tickets' : 'Theme & Appearance'}
            </h1>"""
)

# Header Desc
content = content.replace(
"""            <p className="text-xs text-slate-400">
              {activeTab === 'profile' 
                ? 'Update your personal credentials, security keys, and account preferences.'
                : 'Customize your dashboard visual theme, accent colors, and display mode.'}
            </p>""",
"""            <p className="text-xs text-slate-400">
              {activeTab === 'profile' 
                ? 'Update your personal credentials, security keys, and account preferences.'
                : activeTab === 'tickets'
                ? 'Submit issues and track your ongoing support requests.'
                : 'Customize your dashboard visual theme, accent colors, and display mode.'}
            </p>"""
)

# Add ticket state and imports
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { AdminSupportTicket, AdminTicketMessage } from '../types';\nimport { getStoredTickets, saveStoredTickets } from '../utils/ticketSync';\nimport { UserTicketsTab } from './UserTicketsTab';")


state_to_add = """  const [tickets, setTickets] = useState<AdminSupportTicket[]>(() => getStoredTickets());

  useEffect(() => {
    const handleTicketUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) setTickets((e as CustomEvent).detail);
      else setTickets(getStoredTickets());
    };
    window.addEventListener('astro_tickets_changed', handleTicketUpdate);
    const handleStorage = () => setTickets(getStoredTickets());
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('astro_tickets_changed', handleTicketUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateTicketsAndSync = (newTickets: AdminSupportTicket[]) => {
    setTickets(newTickets);
    saveStoredTickets(newTickets);
  };
"""
content = content.replace("const [compactMode, setCompactMode] = useState(false);", "const [compactMode, setCompactMode] = useState(false);\n" + state_to_add)

# Add UserTicketsTab in main content
tab_ui = """        {activeTab === 'tickets' && (
          <UserTicketsTab 
            tickets={tickets.filter(t => t.userEmail === userEmail)}
            allTickets={tickets}
            userName={userName}
            userEmail={userEmail}
            onUpdate={updateTicketsAndSync}
            onShowToast={onShowToast}
          />
        )}"""
content = content.replace("{/* Profile Content */}", tab_ui + "\n        {/* Profile Content */}")

with open("src/components/UserDashboard.tsx", "w") as f:
    f.write(content)
print("UserDashboard patched")

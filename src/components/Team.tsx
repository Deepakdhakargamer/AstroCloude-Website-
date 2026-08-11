import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AdminStaff } from '../types';
import { getStoredStaff } from '../utils/staffSync';
import { Github, Twitter, Youtube, Instagram, Globe, MessageSquare } from 'lucide-react';

export function Team() {
  const [staffList, setStaffList] = useState<AdminStaff[]>(getStoredStaff());

  useEffect(() => {
    const handleStaffUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) {
        setStaffList((e as CustomEvent).detail);
      } else {
        setStaffList(getStoredStaff());
      }
    };
    
    const handleStorage = () => {
      setStaffList(getStoredStaff());
    };

    window.addEventListener('astro_staff_changed', handleStaffUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('astro_staff_changed', handleStaffUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const activeStaff = staffList
    .filter(s => s.status === 'active')
    .sort((a, b) => a.order - b.order);

  if (activeStaff.length === 0) return null;

  // Group staff by role
  const roleGroups = activeStaff.reduce((acc, staff) => {
    const roleName = staff.role === 'Custom Role' ? (staff.customRoleName || 'Staff') : staff.role;
    if (!acc[roleName]) {
      acc[roleName] = [];
    }
    acc[roleName].push(staff);
    return acc;
  }, {} as Record<string, AdminStaff[]>);

  // Order roles (Owner first, etc.)
  const roleOrder = ['Owner', 'Co-Owner', 'Administrator', 'Developer', 'Manager', 'Moderator', 'Support'];
  
  const sortedRoleNames = Object.keys(roleGroups).sort((a, b) => {
    const idxA = roleOrder.indexOf(a);
    const idxB = roleOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <section className="py-24 relative overflow-hidden" id="team">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Team</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              The passionate experts behind AstroCloude dedicated to providing you with the ultimate hosting experience.
            </p>
          </motion.div>
        </div>

        <div className="space-y-20">
          {sortedRoleNames.map((roleName, groupIndex) => (
            <div key={roleName}>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-bold text-white">{roleName}</h3>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-400">
                  {roleGroups[roleName].length} Member{roleGroups[roleName].length !== 1 ? 's' : ''}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {roleGroups[roleName].map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm group hover:border-purple-500/30 hover:bg-slate-900/80 transition-all duration-500"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                      {member.backgroundImage ? (
                        <img src={member.backgroundImage} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
                      ) : (
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                      )}
                      {member.featured && (
                        <div className="absolute top-4 right-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <div className="px-6 pb-6 pt-0 relative">
                      <div className="-mt-12 mb-4">
                        <img
                          src={member.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                          alt={member.name}
                          className="w-24 h-24 rounded-2xl border-4 border-slate-950 object-cover bg-slate-800 shadow-xl"
                        />
                      </div>

                      <h4 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-sm text-slate-400 mb-4">@{member.username}</p>

                      <div className="mb-4">
                        <span 
                          className="inline-block px-3 py-1 rounded-lg text-xs font-bold border"
                          style={{ 
                            backgroundColor: `${member.badgeColor}15`, 
                            color: member.badgeColor,
                            borderColor: `${member.badgeColor}30` 
                          }}
                        >
                          {roleName}
                        </span>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3">
                        {member.shortBio}
                      </p>

                      <div className="space-y-4">
                        {member.discordUsername && (
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/50 p-2 rounded-xl border border-white/5">
                            <MessageSquare className="w-4 h-4 text-indigo-400" />
                            {member.discordUsername}
                          </div>
                        )}

                        {member.socialLinks && Object.values(member.socialLinks).some(val => val) && (
                          <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                            {member.socialLinks.twitter && (
                              <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                                <Twitter className="w-4 h-4" />
                              </a>
                            )}
                            {member.socialLinks.github && (
                              <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {member.socialLinks.youtube && (
                              <a href={member.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-red-500 transition-colors">
                                <Youtube className="w-4 h-4" />
                              </a>
                            )}
                            {member.socialLinks.instagram && (
                              <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-500 transition-colors">
                                <Instagram className="w-4 h-4" />
                              </a>
                            )}
                            {member.socialLinks.website && (
                              <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors">
                                <Globe className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

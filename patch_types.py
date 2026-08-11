with open("src/types.ts", "r") as f:
    content = f.read()

staff_type = """
export interface AdminStaff {
  id: string;
  name: string;
  username: string;
  role: 'Owner' | 'Co-Owner' | 'Administrator' | 'Developer' | 'Support' | 'Moderator' | 'Manager' | 'Custom Role';
  customRoleName?: string;
  shortBio: string;
  fullDescription: string;
  profileImage: string;
  discordUsername: string;
  discordUserId?: string;
  discordProfileLink?: string;
  email?: string;
  badgeColor: string;
  socialLinks: {
    discord?: string;
    github?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  order: number;
  featured: boolean;
  status: 'active' | 'hidden';
}
"""

if "AdminStaff" not in content:
    content += staff_type
    with open("src/types.ts", "w") as f:
        f.write(content)
    print("Added AdminStaff type")

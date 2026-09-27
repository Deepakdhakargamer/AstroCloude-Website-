import { get, set } from 'idb-keyval';
import { AdminUser } from '../types';
import { hashPassword, verifyPassword, generateToken } from './authCrypto';

const STORAGE_KEY = 'astro_users';
const SESSION_STORAGE_KEY = 'astro_current_session';

// Pre-computed PBKDF2 hashes for seed accounts to ensure instant initialization
const INITIAL_USERS_SEED: AdminUser[] = [
  {
    id: 'usr-admin-01',
    name: 'Administrator',
    username: 'admin',
    email: 'admin@astrocloude.com',
    role: 'Admin',
    roles: ['Administrator'],
    status: 'active',
    joinedDate: '2026-01-15',
    serversCount: 3,
    passwordHash: '98ea765bdc9573855a953e79435b6fa1479836ae8c5c7bb781e0586e680d20d7',
    salt: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
  },
  {
    id: 'usr-client-01',
    name: 'Alex Turner',
    username: 'alexturner',
    email: 'alex@example.com',
    role: 'User',
    roles: ['Standard User'],
    status: 'active',
    joinedDate: '2026-02-10',
    serversCount: 1,
    passwordHash: '37cfbb178a9c24ce2e99d3d9ce1cf552467d30f4ee1ef366e679237b60098dfc',
    salt: 'f6e5d4c3b2a10f9e8d7c6b5a4f3e2d1c'
  }
];

export const getStoredUsers = async (): Promise<AdminUser[]> => {
  try {
    const data = await get(STORAGE_KEY);
    if (!data || !Array.isArray(data) || data.length === 0) {
      // Seed default users with computed hashes if empty
      const seeded = await initializeSeedUsers();
      await set(STORAGE_KEY, seeded);
      return seeded;
    }
    return data;
  } catch (err) {
    console.error('Error fetching users from IndexedDB', err);
    return INITIAL_USERS_SEED;
  }
};

async function initializeSeedUsers(): Promise<AdminUser[]> {
  try {
    const adminHash = await hashPassword('Admin@123');
    const userHash = await hashPassword('User@123');

    return [
      {
        id: 'usr-admin-01',
        name: 'Administrator',
        username: 'admin',
        email: 'admin@astrocloude.com',
        role: 'Admin',
        roles: ['Administrator'],
        status: 'active',
        joinedDate: '2026-01-15',
        serversCount: 3,
        passwordHash: adminHash.hash,
        salt: adminHash.salt
      },
      {
        id: 'usr-client-01',
        name: 'Alex Turner',
        username: 'alexturner',
        email: 'alex@example.com',
        role: 'User',
        roles: ['Standard User'],
        status: 'active',
        joinedDate: '2026-02-10',
        serversCount: 1,
        passwordHash: userHash.hash,
        salt: userHash.salt
      }
    ];
  } catch {
    return INITIAL_USERS_SEED;
  }
}

export const saveStoredUsers = async (users: AdminUser[]): Promise<void> => {
  try {
    await set(STORAGE_KEY, users);
    window.dispatchEvent(new CustomEvent('astro_users_changed', { detail: users }));
  } catch (err) {
    console.error('Error saving users to IndexedDB', err);
  }
};

export const registerUser = async (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> => {
  try {
    const name = data.name.trim();
    const username = data.username.trim().toLowerCase();
    const email = data.email.trim().toLowerCase();

    if (!name || !username || !email || !data.password) {
      return { success: false, error: 'All fields are required.' };
    }

    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      return { success: false, error: 'Username can only contain letters, numbers, underscores, and dashes.' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const currentUsers = await getStoredUsers();

    // Check for duplicate email
    const emailExists = currentUsers.some(u => u.email.toLowerCase() === email);
    if (emailExists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Check for duplicate username
    const usernameExists = currentUsers.some(u => u.username?.toLowerCase() === username);
    if (usernameExists) {
      return { success: false, error: 'This username is already taken. Please choose another.' };
    }

    // Securely hash password using PBKDF2 + random salt
    const { hash, salt } = await hashPassword(data.password);

    // Generate guaranteed unique user ID
    let uniqueId = 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    while (currentUsers.some(u => u.id === uniqueId)) {
      uniqueId = 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    }

    const newUser: AdminUser = {
      id: uniqueId,
      name,
      username,
      email,
      role: 'User',
      roles: ['Standard User'],
      status: 'active',
      joinedDate: new Date().toISOString().substring(0, 10),
      serversCount: 0,
      passwordHash: hash,
      salt: salt,
      lastLogin: new Date().toISOString()
    };

    const updated = [newUser, ...currentUsers];
    await saveStoredUsers(updated);

    return { success: true, user: newUser };
  } catch (err: any) {
    console.error('Registration error', err);
    return { success: false, error: err.message || 'An error occurred during registration.' };
  }
};

export const loginUser = async (
  identifier: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string }> => {
  try {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !password) {
      return { success: false, error: 'Please enter your username/email and password.' };
    }

    const currentUsers = await getStoredUsers();
    const user = currentUsers.find(
      u => u.email.toLowerCase() === cleanId || (u.username && u.username.toLowerCase() === cleanId)
    );

    if (!user) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    if (user.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended. Please contact support.' };
    }

    if (user.status === 'banned') {
      return { success: false, error: 'Your account has been banned due to terms violation.' };
    }

    // Verify hashed password
    let isValid = false;
    if (user.passwordHash && user.salt) {
      isValid = await verifyPassword(password, user.passwordHash, user.salt);
    } else if (user.password) {
      // Legacy fallback: if plain text password exists, verify & immediately upgrade to salted hash
      if (user.password === password) {
        isValid = true;
        const upgraded = await hashPassword(password);
        user.passwordHash = upgraded.hash;
        user.salt = upgraded.salt;
        delete user.password;
        await saveStoredUsers(currentUsers);
      }
    }

    if (!isValid) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    await saveStoredUsers(currentUsers);

    // Create session token
    const token = generateToken();
    const session = { user, token };
    setCurrentSession(session);

    return { success: true, user, token };
  } catch (err: any) {
    console.error('Login error', err);
    return { success: false, error: err.message || 'An error occurred during login.' };
  }
};

export const isUserAdmin = (user?: AdminUser | null): boolean => {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  const roles = (user.roles || []).map(r => (r || '').toLowerCase());
  return role === 'admin' || roles.includes('administrator') || roles.includes('admin');
};

export const getCurrentSession = (): { user: AdminUser; token: string } | null => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading auth session', err);
    return null;
  }
};

export const setCurrentSession = (session: { user: AdminUser; token: string } | null): void => {
  try {
    if (!session) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem('astro_user_session');
      sessionStorage.removeItem('astro_user_session');
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    window.dispatchEvent(new CustomEvent('astro_auth_changed', { detail: session }));
  } catch (err) {
    console.error('Error saving auth session', err);
  }
};

export const logoutUser = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('astro_user_session');
    sessionStorage.removeItem('astro_user_session');
    localStorage.removeItem('astro_auth_token');
    window.dispatchEvent(new CustomEvent('astro_auth_changed', { detail: null }));
  } catch (err) {
    console.error('Error logging out user', err);
  }
};

export const verifySessionWithDatabase = async (): Promise<AdminUser | null> => {
  try {
    const session = getCurrentSession();
    if (!session || !session.user || !session.user.id) {
      return null;
    }
    const users = await getStoredUsers();
    const dbUser = users.find(u => u.id === session.user.id);
    if (!dbUser) {
      logoutUser();
      return null;
    }
    if (dbUser.status === 'suspended' || dbUser.status === 'banned') {
      logoutUser();
      return null;
    }
    // Update session user with the database user record to prevent role spoofing
    if (session.user.role !== dbUser.role || JSON.stringify(session.user.roles) !== JSON.stringify(dbUser.roles)) {
      setCurrentSession({
        ...session,
        user: dbUser
      });
    }
    return dbUser;
  } catch (err) {
    console.error('Error verifying session with database', err);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<AdminUser>): Promise<void> => {
  const users = await getStoredUsers();
  const updated = users.map(u => (u.id === userId ? { ...u, ...updates } : u));
  await saveStoredUsers(updated);

  // If currently logged-in user is updated, update session too
  const current = getCurrentSession();
  if (current && current.user.id === userId) {
    setCurrentSession({
      ...current,
      user: { ...current.user, ...updates }
    });
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  const users = await getStoredUsers();
  const updated = users.filter(u => u.id !== userId);
  await saveStoredUsers(updated);

  // If deleting self, logout
  const current = getCurrentSession();
  if (current && current.user.id === userId) {
    logoutUser();
  }
};

export const resetUserPassword = async (userId: string, newPass: string): Promise<boolean> => {
  try {
    const { hash, salt } = await hashPassword(newPass);
    await updateUser(userId, {
      passwordHash: hash,
      salt: salt
    });
    return true;
  } catch (err) {
    console.error('Error resetting password', err);
    return false;
  }
};

export const createUserByAdmin = async (data: {
  name: string;
  username: string;
  email: string;
  role: 'Admin' | 'Staff' | 'Support' | 'User';
  roles: string[];
  status: 'active' | 'suspended' | 'banned';
  password: string;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> => {
  try {
    const currentUsers = await getStoredUsers();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    if (currentUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Email already in use.' };
    }
    if (currentUsers.some(u => u.username?.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username already in use.' };
    }

    const { hash, salt } = await hashPassword(data.password || 'Temp@1234');
    let uniqueId = 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    while (currentUsers.some(u => u.id === uniqueId)) {
      uniqueId = 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    }

    const newUser: AdminUser = {
      id: uniqueId,
      name: data.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      role: data.role,
      roles: data.roles.length > 0 ? data.roles : [data.role],
      status: data.status,
      joinedDate: new Date().toISOString().substring(0, 10),
      serversCount: 0,
      passwordHash: hash,
      salt: salt
    };

    await saveStoredUsers([newUser, ...currentUsers]);
    return { success: true, user: newUser };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error creating user' };
  }
};

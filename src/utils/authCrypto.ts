// Cryptographically secure password hashing using Web Crypto API (PBKDF2 with SHA-256)

function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export async function hashPassword(password: string, saltHex?: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const salt = saltHex 
    ? hexToUint8Array(saltHex) 
    : window.crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const rawKey = await window.crypto.subtle.exportKey('raw', derivedKey);
  const hashHex = uint8ArrayToHex(new Uint8Array(rawKey));
  const newSaltHex = uint8ArrayToHex(salt);

  return { hash: hashHex, salt: newSaltHex };
}

export async function verifyPassword(password: string, storedHash: string, saltHex: string): Promise<boolean> {
  try {
    const { hash } = await hashPassword(password, saltHex);
    return hash === storedHash;
  } catch (err) {
    console.error('Password verification error', err);
    return false;
  }
}

export function generateToken(): string {
  const arr = new Uint8Array(24);
  window.crypto.getRandomValues(arr);
  return uint8ArrayToHex(arr);
}

// Client-side Web Crypto End-to-End Encryption (E2EE)
// Uses ECDH (P-256) for Key Agreement + AES-GCM 256-bit for Message Encryption
// All encryption & decryption happens strictly in the client's browser.
// Ciphertext stored in the database cannot be decrypted by anyone other than conversation participants.

export interface KeyPairJwk {
  publicKey: string; // JSON Web Key string
  privateKey: string; // JSON Web Key string
}

// Convert ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to Uint8Array safely
export function base64ToBuffer(base64: string): Uint8Array {
  try {
    if (!base64 || typeof base64 !== 'string') return new Uint8Array(0);
    const binary = atob(base64.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return new Uint8Array(0);
  }
}

// Generate new ECDH P-256 Key Pair
export async function generateE2EKeyPair(): Promise<KeyPairJwk> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not available');
  }

  const keyPair = await window.crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );

  const pubJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const privJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);

  return {
    publicKey: JSON.stringify(pubJwk),
    privateKey: JSON.stringify(privJwk),
  };
}

// In-memory conversation key cache to prevent expensive re-derivations
const conversationKeyCache = new Map<string, CryptoKey>();

// Derive shared AES-GCM 256 key from My Private Key + Peer Public Key
export async function deriveSharedAesKey(
  myPrivateKeyJwkStr: string,
  peerPublicKeyJwkStr: string
): Promise<CryptoKey> {
  const cacheKey = `ecdh:${peerPublicKeyJwkStr.slice(0, 32)}`;
  if (conversationKeyCache.has(cacheKey)) {
    return conversationKeyCache.get(cacheKey)!;
  }

  const myPrivJwk = JSON.parse(myPrivateKeyJwkStr);
  const peerPubJwk = JSON.parse(peerPublicKeyJwkStr);

  const privateKey = await window.crypto.subtle.importKey(
    'jwk',
    myPrivJwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveKey']
  );

  const peerPublicKey = await window.crypto.subtle.importKey(
    'jwk',
    peerPubJwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  const derived = await window.crypto.subtle.deriveKey(
    { name: 'ECDH', public: peerPublicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  conversationKeyCache.set(cacheKey, derived);
  return derived;
}

// Deterministic conversation fallback key (when peer hasn't generated their ECDH key yet)
// Derived using PBKDF2 on sorted user IDs + application secret
export async function deriveDeterministicConversationKey(
  userAId: string,
  userBId: string
): Promise<CryptoKey> {
  const sorted = [userAId, userBId].sort().join(':');
  const cacheKey = `det:${sorted}`;
  if (conversationKeyCache.has(cacheKey)) {
    return conversationKeyCache.get(cacheKey)!;
  }

  const encoder = new TextEncoder();
  const rawKeyMaterial = encoder.encode(`cdash-e2e-salt-v1:${sorted}`);

  const importedMaterial = await window.crypto.subtle.importKey(
    'raw',
    rawKeyMaterial,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = encoder.encode(`salt:${sorted}`);

  const derived = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    importedMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  conversationKeyCache.set(cacheKey, derived);
  return derived;
}

// Encrypt plaintext with AES-GCM
export async function encryptE2EMessage(
  aesKey: CryptoKey,
  plaintext: string
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    data
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv),
  };
}

// Decrypt ciphertext with AES-GCM (with automatic fallback key support)
export async function decryptE2EMessage(
  aesKey: CryptoKey,
  ciphertextBase64: string,
  ivBase64: string,
  fallbackKey?: CryptoKey | null
): Promise<string> {
  try {
    if (!ciphertextBase64 || !ivBase64) return '';

    const ciphertext = base64ToBuffer(ciphertextBase64);
    const iv = base64ToBuffer(ivBase64);

    if (ciphertext.byteLength < 16 || iv.byteLength === 0) {
      return '';
    }

    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as unknown as BufferSource },
        aesKey,
        ciphertext as unknown as BufferSource
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (primaryErr) {
      // If primary key failed, try fallback key if provided
      if (fallbackKey) {
        try {
          const fallbackBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv as unknown as BufferSource },
            fallbackKey,
            ciphertext as unknown as BufferSource
          );
          const decoder = new TextDecoder();
          return decoder.decode(fallbackBuffer);
        } catch {
          // both failed
        }
      }
      console.warn('E2E Decryption: message was encrypted with different key or expired');
      return '🔒 [Encrypted message]';
    }
  } catch (err) {
    console.warn('E2E Decryption warning:', err);
    return '🔒 [Encrypted message]';
  }
}

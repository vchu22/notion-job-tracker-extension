// Encryption utilities using Web Crypto API
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

/**
 * Generate a cryptographic key from a password
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const baseKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt data using AES-GCM
 */
export async function encryptData(data: string, password: string): Promise<string> {
    try {
        // Generate salt and IV
        const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
        const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

        // Derive key from password
        const key = await deriveKey(password, salt);

        // Encrypt the data
        const encrypted = await crypto.subtle.encrypt(
            { name: ALGORITHM, iv: iv },
            key,
            new TextEncoder().encode(data)
        );

        // Combine salt + IV + encrypted data
        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);

        // Convert to base64 for storage
        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptData(encryptedData: string, password: string): Promise<string> {
    try {
        // Convert from base64
        const combined = new Uint8Array(
            atob(encryptedData).split('').map(char => char.charCodeAt(0))
        );

        // Extract salt, IV, and encrypted data
        const salt = combined.slice(0, SALT_LENGTH);
        const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH);

        // Derive key from password
        const key = await deriveKey(password, salt);

        // Decrypt the data
        const decrypted = await crypto.subtle.decrypt(
            { name: ALGORITHM, iv: iv },
            key,
            encrypted
        );

        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt data. Check your password.');
    }
}

/**
 * Generate a secure password for the extension
 * This creates a unique password based on the extension ID and user's browser
 */
export async function generateExtensionPassword(): Promise<string> {
    // Use extension ID and stable browser properties to create a unique password
    const extensionId = chrome.runtime.id;
    const userAgent = navigator.userAgent;
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;

    // Create a hash of the extension-specific data
    const data = `${extensionId}-${userAgent}-${hardwareConcurrency}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert to base64 for use as password
    return btoa(String.fromCharCode(...hashArray));
} 
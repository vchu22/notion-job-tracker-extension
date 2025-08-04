// Chrome Extension Storage Utilities
import { encryptData, decryptData, generateExtensionPassword } from './encryption';

export interface StoredCredentials {
    databaseId?: string;
    apiKey?: string;
}

// Cache the extension password to avoid regenerating it
let cachedPassword: string | null = null;

/**
 * Get the extension password (cached for performance)
 */
async function getExtensionPassword(): Promise<string> {
    if (!cachedPassword) {
        cachedPassword = await generateExtensionPassword();
    }
    return cachedPassword;
}

/**
 * Save encrypted credentials to Chrome storage
 */
export const saveCredentials = async (databaseId: string, apiKey: string): Promise<void> => {
    try {
        const password = await getExtensionPassword();

        // Encrypt both credentials
        const encryptedDatabaseId = await encryptData(databaseId, password);
        const encryptedApiKey = await encryptData(apiKey, password);

        return new Promise((resolve, reject) => {
            chrome.storage.local.set({
                databaseId: encryptedDatabaseId,
                apiKey: encryptedApiKey
            }, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('Failed to encrypt credentials:', error);
        throw new Error('Failed to save encrypted credentials');
    }
};

/**
 * Load and decrypt credentials from Chrome storage
 */
export const loadCredentials = async (): Promise<StoredCredentials> => {
    try {
        const password = await getExtensionPassword();

        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['databaseId', 'apiKey'], async (result: StoredCredentials) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                try {
                    const decryptedResult: StoredCredentials = {};

                    // Decrypt databaseId if it exists
                    if (result.databaseId) {
                        try {
                            decryptedResult.databaseId = await decryptData(result.databaseId, password);
                        } catch (error) {
                            console.warn('Failed to decrypt databaseId, may be old unencrypted data:', error);
                            // Fallback to unencrypted data for backward compatibility
                            decryptedResult.databaseId = result.databaseId;
                        }
                    }

                    // Decrypt apiKey if it exists
                    if (result.apiKey) {
                        try {
                            decryptedResult.apiKey = await decryptData(result.apiKey, password);
                        } catch (error) {
                            console.warn('Failed to decrypt apiKey, may be old unencrypted data:', error);
                            // Fallback to unencrypted data for backward compatibility
                            decryptedResult.apiKey = result.apiKey;
                        }
                    }
                    resolve(decryptedResult);
                } catch (error) {
                    console.error('Failed to decrypt credentials:', error);
                    reject(new Error('Failed to decrypt stored credentials'));
                }
            });
        });
    } catch (error) {
        console.error('Failed to get extension password:', error);
        throw new Error('Failed to load encrypted credentials');
    }
};

/**
 * Clear credentials from Chrome storage
 */
export const clearCredentials = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(['databaseId', 'apiKey'], () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve();
            }
        });
    });
};

/**
 * Check if stored credentials are encrypted
 * Returns true if credentials exist and are encrypted, false otherwise
 */
export const areCredentialsEncrypted = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['databaseId', 'apiKey'], (result: StoredCredentials) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            // Check if we have any stored credentials
            if (!result.databaseId && !result.apiKey) {
                resolve(false);
                return;
            }

            // Check if the stored data looks like encrypted data (base64 with specific length patterns)
            const isEncrypted = (data: string): boolean => {
                try {
                    // Decode base64 to check if it's valid
                    const decoded = atob(data);
                    const bytes = new Uint8Array(decoded.length);
                    for (let i = 0; i < decoded.length; i++) {
                        bytes[i] = decoded.charCodeAt(i);
                    }

                    // Encrypted data should be at least 44 bytes (salt + iv + minimum encrypted data)
                    return bytes.length >= 44;
                } catch {
                    return false;
                }
            };

            const databaseIdEncrypted = result.databaseId ? isEncrypted(result.databaseId) : true;
            const apiKeyEncrypted = result.apiKey ? isEncrypted(result.apiKey) : true;

            resolve(databaseIdEncrypted && apiKeyEncrypted);
        });
    });
}; 
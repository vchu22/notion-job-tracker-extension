export interface Settings {
    [key: string]: any;
}

export const saveSettings = async (config: Settings): Promise<void> => {
    try {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(config, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve();
                }
            });
        });
    } catch (error) {
        throw new Error('Failed to save settings');
    }
};

export const loadSettings = async (keys: Array<string>): Promise<Settings> => {
    try {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(keys, async (result: Settings) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                const settings = keys.reduce((acc: Settings, key) => {
                    if (result[key]) acc[key] = result[key];
                    return acc;
                }, {});

                resolve(settings);
            });
        });
    } catch (error) {
        throw new Error('Failed to load settings');
    }
};

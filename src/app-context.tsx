import React, { createContext, useState, ReactNode, useContext } from "react";

interface AppContextType {
    databaseId: string, setDatabaseId: (text: string) => void;
    apiKey: string, setApiKey: (text: string) => void;
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
    const [databaseId, setDatabaseId] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    console.log(databaseId)
    return (
        <AppContext.Provider value={{ databaseId, setDatabaseId, apiKey, setApiKey }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}

export default AppContext;
import React, { createContext, useState, ReactNode, useContext } from "react";
import { NotionDataSource } from "./lib/util-functions";

interface AppContextType {
    databaseId: string, setDatabaseId: (text: string) => void;
    apiKey: string, setApiKey: (text: string) => void;
    dataSourceId: string, setDataSourceId: (text: string) => void;
    dataSources: NotionDataSource[], setDataSources: (sources: NotionDataSource[]) => void;
    firstTimeRun: boolean, setFirstTimeRun: (value: boolean) => void;
    boardName: string, setBoardName: (text: string) => void;
    boardIcon: string, setBoardIcon: (text: string) => void;
    boardColumns: object, setBoardColumns: (obj: object) => void;
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
    const [databaseId, setDatabaseId] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    const [dataSourceId, setDataSourceId] = useState<string>("");
    const [dataSources, setDataSources] = useState<NotionDataSource[]>([]);
    const [firstTimeRun, setFirstTimeRun] = useState<boolean>(true);
    const [boardName, setBoardName] = useState<string>("");
    const [boardIcon, setBoardIcon] = useState<string>("");
    const [boardColumns, setBoardColumns] = useState<object>({});

    return (
        <AppContext.Provider value={{ databaseId, setDatabaseId, apiKey, setApiKey, dataSourceId, setDataSourceId,
            dataSources, setDataSources, firstTimeRun, setFirstTimeRun,
            boardName, setBoardName, boardIcon, setBoardIcon, boardColumns, setBoardColumns}}>
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
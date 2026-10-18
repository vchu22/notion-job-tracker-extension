const NOTION_API_VERSION = "2026-03-11";

export interface NotionDataSource {
    id: string;
    name: string;
}

interface NotionDatabase {
    title?: Array<{ plain_text?: string }>;
    icon?: {
        external?: { url: string };
        file?: { url: string };
    } | null;
    data_sources?: NotionDataSource[];
}

interface NotionDataSourceDetails {
    properties: Record<string, object>;
}

interface NotionErrorResponse {
    message?: string;
}

const notionRequest = async <T>(url: string, apiKey: string, init: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            "Notion-Version": NOTION_API_VERSION,
            "Authorization": `Bearer ${apiKey}`,
            ...init.headers
        }
    });
    const data = await response.json();

    if (!response.ok) {
        const error = data as NotionErrorResponse;
        throw new Error(error.message || `Notion API request failed (${response.status})`);
    }

    return data as T;
};

export const initFieldValues = (boardColumns: object, activeTabURL: string) => Object.keys(boardColumns).reduce((acc, key) => {
    const acceptedTypes = ["title", "text", "rich_text", "number", "date", "select", "multi_select"]
    // @ts-ignore
    const type: string = boardColumns[key]["type"]
    if (acceptedTypes.includes(type)) return ({...acc, [key]: ""})
    else if (type == "url") return ({...acc, [key]: activeTabURL})
    else return ({...acc})
}, {});

export const getDatabaseStructure = async (databaseId: string, apiKey: string, selectedDataSourceId = "") => {
    const database = await notionRequest<NotionDatabase>(
        `https://api.notion.com/v1/databases/${encodeURIComponent(databaseId)}`,
        apiKey
    );
    const dataSources = database.data_sources;

    if (!dataSources?.length) {
        throw new Error("This database does not contain any data sources.");
    }

    const dataSource = dataSources.find(source => source.id === selectedDataSourceId)
        ?? (dataSources.length === 1 ? dataSources[0] : undefined);
    const structure = {
        boardName: database.title?.[0]?.plain_text || dataSources[0].name,
        boardIcon: database.icon?.external?.url || database.icon?.file?.url || "",
        dataSources,
        dataSourceId: dataSource?.id || "",
        boardColumns: {} as Record<string, object>
    };

    if (!dataSource) {
        return structure;
    }

    const details = await notionRequest<NotionDataSourceDetails>(
        `https://api.notion.com/v1/data_sources/${encodeURIComponent(dataSource.id)}`,
        apiKey
    );

    return { ...structure, boardColumns: details.properties };
};

export const saveToDatabase = async (dataSourceId: string, apiKey: string, properties: { [key: string]: any }) => {
    await notionRequest("https://api.notion.com/v1/pages", apiKey, {
        method: "POST",
        body: JSON.stringify({
            parent: { type: "data_source_id", data_source_id: dataSourceId },
            properties
        })
    });
    console.log("Row successfully added!");
};

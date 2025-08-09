import React, { useEffect } from "react";
import { useAppContext } from "../app-context";
import { saveCredentials, loadCredentials, clearCredentials } from "../lib/storage";

function CredentialsInputPage() {
    const { databaseId, setDatabaseId, apiKey, setApiKey } = useAppContext()

    // Load saved credentials when component mounts
    useEffect(() => {
        loadCredentials()
            .then((result) => {
                if (result.databaseId) setDatabaseId(result.databaseId);
                if (result.apiKey) setApiKey(result.apiKey);
            })
            .catch((error) => {
                console.error('Failed to load credentials:', error);
            });
    }, [setDatabaseId, setApiKey]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Save credentials to Chrome storage
        saveCredentials(databaseId, apiKey)
            .catch((error) => {
                console.error('Failed to save credentials:', error);
            });

        fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
                'Authorization': `Bearer ${apiKey}`,
            }
        }).then((response) => response.json())
            .then((data) => {
                // Handle the fetched data here
                console.log(data)
            })
            .catch(error => {
                // Handle any errors
                console.log("Error: ", error)
            });
    }

    const handleClear = () => {
        setDatabaseId("");
        setApiKey("");
        // Also clear from storage
        clearCredentials()
            .catch((error) => {
                console.error('Failed to clear credentials:', error);
            });
    }

    return (
        <>
            <h3>Connect to your Notion database.</h3>
            <p>Note: You will need to create your own Notion page with the job tracker database and a Notion API key to access your database. Follow this <a href=''>guide</a> on how to get your Notion ID and API key.</p>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Connection Credentials</legend>
                    <legend>Database ID</legend>
                    <input type="text" id="databaseId" value={databaseId}
                        onChange={e => setDatabaseId(e.target.value)}
                    />
                    <legend>API Key</legend>
                    <input type="password" id="apiKey" value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                    />
                </fieldset>
                <div className="flex flex-row justify-end">
                    <input type="button" value="Clear" onClick={handleClear} />
                    <input type="submit" value="Connect" />
                </div>
            </form>
        </>
    )
}

export default CredentialsInputPage;
import React, {useEffect, useState} from "react";
import { useAppContext } from "../app-context";
import { saveCredentials, loadCredentials, clearCredentials } from "../lib/db-credentials";

function CredentialsInputPage() {
    const { databaseId, setDatabaseId, apiKey, setApiKey } = useAppContext()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

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
        if (databaseId.length < 1){
            setErrorMessage("Database ID cannot be empty.")
            setShowError(true);
        } else if (!/^[a-zA-Z0-9-_]+$/.test(databaseId)) {
            setErrorMessage("Database ID contains invalid characters.");
            setShowError(true);
        } else if (apiKey.length < 1) {
            setErrorMessage("API Key cannot be empty.");
            setShowError(true);
        } else if (!/^[a-zA-Z0-9-_]+$/.test(apiKey)) {
            setErrorMessage("API Key contains invalid characters.");
            setShowError(true);
        } else {
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
                    console.log(data.status, data)
                    if (data.status) {       // if server returns any error status code
                        setErrorMessage(data.message);
                        setShowError(true);
                    } else {
                        setErrorMessage("");
                        setShowError(false);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.log("Error: ", error)
                    setErrorMessage("Cannot connect: "+error)
                    setShowError(true);
                });
        }
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
            <h3>Connect to your Notion database</h3>
            <p>Note: You will need to create your own Notion page with a database and a Notion API key to access your database. Follow this <a href=''>guide</a> on how to get your Notion database ID and API key.</p>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Connection Credentials</legend>
                    {showError? <legend className="error-message">{errorMessage}</legend>: ""}
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
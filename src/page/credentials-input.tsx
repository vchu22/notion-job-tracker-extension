import React, { useEffect } from "react";
import { useAppContext } from "../app-context";

function CredentialsInput() {
    const { databaseId, setDatabaseId, apiKey, setApiKey } = useAppContext()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Credentials:", { databaseId, apiKey });
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
    }

    return (
        <div>
            <h3>Enter the credentials to connect to your Notion.</h3>
            <p>Note: You will need to create your own Notion page with the job tracker database and a Notion API key to access your database. Follow this <a href=''>guide</a> on how to get your Notion ID and API key.</p>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Connection Credentials</legend>
                    <legend>Database ID</legend>
                    <input type="text" id="databaseId" value={databaseId}
                        onChange={e => setDatabaseId(e.target.value)}
                    />
                    <legend>API Key</legend>
                    <input type="text" id="apiKey" value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                    />
                </fieldset>
                <div className="flex flex-row justify-end">
                    <input type="button" value="Clear" onClick={handleClear} />
                    <input type="submit" value="Connect" />
                </div>
            </form>
        </div>
    )
}

export default CredentialsInput;
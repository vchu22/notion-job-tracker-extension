import React, {useEffect, useState} from "react";
import { goTo } from 'react-chrome-extension-router';
import JobTrackingBoard from './job-tracking-board'
import { useAppContext } from "../app-context";
import { saveCredentials, loadCredentials, clearCredentials } from "../lib/db-credentials";

function CredentialsInputPage() {
    const { databaseId, setDatabaseId, apiKey, setApiKey, setBoardName, setBoardIcon, setBoardColumns } = useAppContext()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showModal, setShowModal] = useState(false)

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
        // input validations
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
                    if (data.status) {       // if server returns any error status code
                        setErrorMessage(data.message);
                        setShowError(true);
                    } else {
                        setErrorMessage("");
                        setShowError(false);
                        setShowModal(true);
                        setBoardName(data["title"][0]["plain_text"]); // Notion page title
                        setBoardIcon(data["icon"]["external"]["url"]);
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
            {showModal? <Modal databaseId={databaseId} apiKey={apiKey} setShowModal={setShowModal}/>: null}
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

const Modal = ({databaseId, apiKey, setShowModal} : {databaseId: string, apiKey: string, setShowModal: Function}) => {
    const handleClick = (answer: boolean) => {
        if (answer) {
            // Save credentials to Chrome storage
            saveCredentials(databaseId, apiKey)
                .catch((error) => {
                    console.error('Failed to save credentials:', error);
                });
        }
        setShowModal(false);
        goTo(JobTrackingBoard)
    }
    return (
        <div className="modal">
            <div className="modal-dialog">
                <p>Do you want to save your database connection credentials?</p>
                <div className="flex flex-row justify-end">
                    <button onClick={()=>{handleClick(true)}} className="primary">Yes</button>
                    <button onClick={()=>{handleClick(false)}}>No</button>
                </div>
            </div>
        </div>
    )
}
export default CredentialsInputPage;
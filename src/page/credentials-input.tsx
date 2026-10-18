import React, { useEffect, useState } from "react";
import { goTo } from 'react-chrome-extension-router';
import JobTrackingBoard from './job-tracking-board'
import { useAppContext } from "../app-context";
import { saveCredentials, loadCredentials, clearCredentials } from "../lib/db-credentials";
import { saveSettings } from "../lib/settings";
import { MainPage } from "../lib/util-consts";
import { getDatabaseStructure } from "../lib/util-functions";
import NotionCredentialsGuide from "./notion-credentials-guide";

function CredentialsInputPage() {
    const {
        databaseId, setDatabaseId, apiKey, setApiKey, dataSourceId, setDataSourceId, dataSources, setDataSources,
        setBoardName, setBoardIcon, setBoardColumns
    } = useAppContext()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showModal, setShowModal] = useState(false)

    // Load saved credentials when component mounts
    useEffect(() => {
        loadCredentials()
            .then((result) => {
                if (result.databaseId) setDatabaseId(result.databaseId);
                if (result.apiKey) setApiKey(result.apiKey);
                if (result.dataSourceId) setDataSourceId(result.dataSourceId);
            })
            .catch((error) => {
                console.error('Failed to load credentials:', error);
            });
    }, [setDatabaseId, setApiKey, setDataSourceId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // input validations
        if (databaseId.length < 1) {
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
            loadDatabaseStructure(dataSourceId)
        }
    }

    const applyStructure = (structure: Awaited<ReturnType<typeof getDatabaseStructure>>) => {
        setBoardName(structure.boardName);
        setBoardIcon(structure.boardIcon);
        setDataSources(structure.dataSources);
        setDataSourceId(structure.dataSourceId);
        setBoardColumns(structure.boardColumns);
    };

    const loadDatabaseStructure = (selectedDataSourceId: string) => {
        setShowError(false);
        getDatabaseStructure(databaseId, apiKey, selectedDataSourceId)
            .then(structure => {
                applyStructure(structure);
                if (!structure.dataSourceId) {
                    setErrorMessage("Choose a data source to continue.");
                    setShowError(true);
                    return;
                }
                setShowModal(true);
            })
            .catch(error => {
                setErrorMessage(error instanceof Error ? error.message : String(error));
                setShowError(true);
            });
    };

    const handleDataSourceChange = (selectedId: string) => {
        setDataSourceId(selectedId);
        loadDatabaseStructure(selectedId);
    };

    const handleClear = () => {
        setDatabaseId("");
        setApiKey("");
        setDataSourceId("");
        setDataSources([]);
        // Also clear from storage
        clearCredentials()
            .catch((error) => {
                console.error('Failed to clear credentials:', error);
            });
    }

    return (
        <>
            {showModal ? <Modal databaseId={databaseId} apiKey={apiKey} dataSourceId={dataSourceId} setShowModal={setShowModal} /> : null}
            <div className="credentials-form-page">
                <h3>Connect to your Notion database</h3>
                <p>Follow this <a href="#credentials-guide" onClick={e => {
                    e.preventDefault();
                    goTo(NotionCredentialsGuide);
                }}>guide</a> to connect your Notion database. </p>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Connection Credentials</legend>
                        {showError ? <legend className="error-message">{errorMessage}</legend> : ""}
                        <legend>Database ID</legend>
                        <input type="text" id="databaseId" value={databaseId}
                            onChange={e => {
                                setDatabaseId(e.target.value);
                                setDataSourceId("");
                                setDataSources([]);
                                setBoardName("");
                                setBoardIcon("");
                                setBoardColumns({});
                            }}
                        />
                        <legend>API Key</legend>
                        <input type="password" id="apiKey" value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                        />
                        {dataSources.length > 1 ?
                            <>
                                <label htmlFor="dataSourceId">Data source</label>
                                <select id="dataSourceId" value={dataSourceId} onChange={e => handleDataSourceChange(e.target.value)}>
                                    <option value="">Choose a data source</option>
                                    {dataSources.map(source => <option key={source.id} value={source.id}>{source.name}</option>)}
                                </select>
                            </> : null}
                    </fieldset>
                    <div className="flex flex-row justify-end">
                        <input type="button" value="Clear" onClick={handleClear} />
                        <input type="button" value="Cancel" onClick={() => goTo(JobTrackingBoard)} />
                        <input type="submit" value="Connect" />
                    </div>
                </form>
            </div>
        </>
    )
}

const Modal = ({ databaseId, apiKey, dataSourceId, setShowModal }: {
    databaseId: string, apiKey: string, dataSourceId: string, setShowModal: (show: boolean) => void
}) => {
    const handleClick = (answer: boolean) => {
        if (answer) {
            // Save credentials to Chrome storage
            saveCredentials(databaseId, apiKey, dataSourceId)
                .catch((error) => {
                    console.error('Failed to save credentials:', error);
                });
            saveSettings({ mainPage: MainPage.JobTrackingBoard }).then();
        }
        setShowModal(false);
        goTo(JobTrackingBoard)
    }
    return (
        <div className="modal">
            <div className="modal-dialog">
                <p>Do you want to save your database connection credentials?</p>
                <div className="flex flex-row justify-end">
                    <button onClick={() => { handleClick(true) }} className="primary">Yes</button>
                    <button onClick={() => { handleClick(false) }}>No</button>
                </div>
            </div>
        </div>
    )
}
export default CredentialsInputPage;
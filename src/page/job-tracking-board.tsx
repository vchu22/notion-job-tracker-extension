import React, {useEffect, useState} from "react";
import { goTo } from 'react-chrome-extension-router';
import SaveJobPost from './save-job-post';
import CredentialsInputPage from "./credentials-input";
import {useAppContext} from "../app-context";
import {getDatabaseStructure} from "../lib/util-functions";
import {saveDataSourceId} from "../lib/db-credentials";

function JobTrackingBoard() {
    const {
        boardName, boardIcon, databaseId, apiKey, dataSourceId, setDataSourceId, dataSources, setDataSources,
        setBoardName, setBoardIcon, setBoardColumns
    } = useAppContext();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!databaseId || !apiKey) return;

        let cancelled = false;
        setIsLoading(true);
        getDatabaseStructure(databaseId, apiKey, dataSourceId)
            .then(structure => {
                if (cancelled) return;
                setBoardName(structure.boardName);
                setBoardIcon(structure.boardIcon);
                setDataSources(structure.dataSources);
                setDataSourceId(structure.dataSourceId);
                setBoardColumns(structure.boardColumns);
                setErrorMessage("");
                setIsLoading(false);
            })
            .catch(error => {
                if (cancelled) return;
                console.error("Failed to load Notion database:", error);
                setErrorMessage(error instanceof Error ? error.message : String(error));
                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [databaseId, apiKey, dataSourceId, setBoardName, setBoardIcon, setBoardColumns, setDataSources, setDataSourceId])

    const handleDataSourceChange = (selectedId: string) => {
        setDataSourceId(selectedId);
        setBoardColumns({});
        saveDataSourceId(selectedId).catch(error => {
            console.error("Failed to save selected Notion data source:", error);
        });
    };

    return (databaseId?
        <>
            {boardIcon ? <img src={boardIcon} alt="" width={64} height={64}/> : null}
            {boardName ? <h3>{boardName}</h3> : null}
            {boardName && dataSources.length > 1 ?
                <>
                    <label htmlFor="dataSourceId">Data source</label>
                    <select id="dataSourceId" value={dataSourceId} onChange={e => handleDataSourceChange(e.target.value)}>
                        <option value="">Choose a data source</option>
                        {dataSources.map(source => <option key={source.id} value={source.id}>{source.name}</option>)}
                    </select>
                </> : null}
            {errorMessage ? <p role="alert">{errorMessage}</p> : null}
            {boardName && dataSourceId && !isLoading ? <button onClick={() => goTo(SaveJobPost)}>Save Job Post</button> : null}
            {boardName ? <button onClick={() => window.open(`https://www.notion.so/${databaseId}`, "_blank")}>View Board</button> : null}
            {boardName ? <button onClick={() => goTo(CredentialsInputPage)}>Edit Connection Credentials</button> : null}
        </>: null
    )
}

export default JobTrackingBoard;
import React, {useEffect} from "react";
import { goTo } from 'react-chrome-extension-router';
import SaveJobPost from './save-job-post';
import CredentialsInputPage from "./credentials-input";
import {useAppContext} from "../app-context";
import {getDatabaseStructure} from "../lib/util-functions";

function JobTrackingBoard() {
    const { boardName, boardIcon, databaseId, apiKey, setBoardName,setBoardIcon,setBoardColumns } = useAppContext();
    useEffect(() => {
        getDatabaseStructure(databaseId,apiKey,setBoardName,setBoardIcon,setBoardColumns);
    })
    return (boardName?
        <>
            <img src={boardIcon} alt="" width={64} height={64}/>
            <h3>{boardName}</h3>
            <button onClick={() => goTo(SaveJobPost)}>Save Job Post</button>
            <button onClick={() => window.open(`https://www.notion.so/${databaseId}`, "_blank")}>View Board</button>
            <button onClick={() => goTo(CredentialsInputPage)}>Edit Connection Credentials</button>
        </>: null
    )
}

export default JobTrackingBoard;
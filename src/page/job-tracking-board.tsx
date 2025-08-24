import React from "react";
import { goTo } from 'react-chrome-extension-router';
import SaveJobPost from './save-job-post';
import CredentialsInputPage from "./credentials-input";
import {useAppContext} from "../app-context";

function JobTrackingBoard() {
    const { boardName, boardIcon } = useAppContext()
    return (
        <>
            <img src={boardIcon} alt="" width={64} height={64}/>
            <h3>{boardName}</h3>
            <button onClick={() => goTo(SaveJobPost)}>Save Job Post</button>
            <button>View Board</button>
            <button onClick={() => goTo(CredentialsInputPage)}>Edit Connection Credentials</button>
        </>
    )
}

export default JobTrackingBoard;
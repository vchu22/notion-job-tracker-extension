import React from "react";
import {useAppContext} from "../app-context";

function JobTrackingBoard() {
    const { boardName } = useAppContext()
    return (
        <>
            <h3>{boardName}</h3>
        </>
    )
}

export default JobTrackingBoard;
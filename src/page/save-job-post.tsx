import React, {useState} from "react";
import { goTo } from 'react-chrome-extension-router';
import {initFieldValues, saveToDatabase} from '../lib/util-functions'
import { createInputField } from '../lib/util-components'
import JobTrackingBoard from "./job-tracking-board";
import {useAppContext} from "../app-context";

function SaveJobPost() {
    const {databaseId, apiKey, boardName, boardColumns} = useAppContext()
    const [activeTabURL, setActiveTabURL] = useState("")
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
        if (tab && typeof tab.url === 'string') {
            setActiveTabURL(tab.url)
        }
    });
    const [fieldValues, setFieldValues] = useState(initFieldValues(boardColumns, activeTabURL))

    return (
        <>
            <form onSubmit={e => {
                e.preventDefault();
                // Convert field values into acceptable formats
                const properties = Object.keys(fieldValues).reduce((acc, key) => {
                    // @ts-ignore
                    if (fieldValues[key] == "") return ({...acc});

                    let val;
                    // @ts-ignore
                    switch (boardColumns[key]["type"]) {
                        case "title":
                        case "rich_text":
                            // @ts-ignore
                            val = [{ text: { content: fieldValues[key] }}]; break;
                        case "number":
                            // @ts-ignore
                            val = Number.parseFloat(fieldValues[key]); break;
                        case "date":
                            // @ts-ignore
                            val = {start: fieldValues[key]}; break;
                        case "select":
                            // @ts-ignore
                            val = {name: fieldValues[key]["value"]}; break;
                        case "multi_select":
                            // @ts-ignore
                            val = fieldValues[key].map(o => {return {name: o["value"]}}); break;
                        default:
                            // @ts-ignore
                            val = fieldValues[key]
                    }
                    return ({...acc, [key]: val})
                }, {})

                // Send a request to save the form values on the Notion database
                saveToDatabase(databaseId, apiKey, properties);
            }}>
                <h3><button onClick={() => goTo(JobTrackingBoard)}>&larr;</button>Save to {boardName}</h3>
                <table>
                    <tbody>
                    { fieldValues? Object.keys(fieldValues).map(key => {
                        // @ts-ignore
                        const type: string = boardColumns[key]["type"]
                        // @ts-ignore
                        const inputField = createInputField(key, type, fieldValues, setFieldValues, (type == "url"? activeTabURL: fieldValues[key]), (type == "select" || type == "multi_select"? boardColumns[key]["select"] || boardColumns[key]["multi_select"] : undefined));

                        return (
                            <tr key={key}>
                                <td className="w-1/5">{key}</td>
                                <td className="w-full">{inputField}</td>
                            </tr>)
                    }):null}
                    </tbody>
                </table>
                <div className="flex flex-row justify-end">
                    <input type="button" value="Clear" onClick={()  => setFieldValues(initFieldValues(boardColumns, activeTabURL))}/>
                    <input type="button" value="Cancel" onClick={()  => goTo(JobTrackingBoard)}/>
                    <input type="submit" name="save_job" value="Save Job"/>
                </div>
            </form>
        </>
    )
}

export default SaveJobPost;
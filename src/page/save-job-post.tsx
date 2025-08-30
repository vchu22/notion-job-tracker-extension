import React, {useState} from "react";
import CreatableSelect from 'react-select/creatable';
import { goTo } from 'react-chrome-extension-router';
import JobTrackingBoard from "./job-tracking-board";
import {useAppContext} from "../app-context";

const createInputField = (name:string, type: string, values: {[key:string]: any}, setValues: any, tabURL?: string, options?: { options: Array<{ id: string, name: string, [key: string]: any }>}) => {
    const opt = options? options["options"].map(o => {return {value: o["name"], label: o["name"]}}) : undefined;
    switch (type) {
        case "rich_text":
            return <textarea id={name} name={name} value={values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>
        case "select":
        case "multi_select":
            return <CreatableSelect isClearable={false} options={opt} onChange={(val) => setValues({...values, [name]: val})} isMulti={type == "multi_select"} />;
        default:
            return <input type={type == "title"? "text": type} id={name} name={name} value={tabURL || values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>;
    }
}

function SaveJobPost() {
    const {boardName, boardColumns} = useAppContext()
    const [activeTabURL, setActiveTabURL] = useState("")
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
        if (tab && typeof tab.url === 'string') {
            setActiveTabURL(tab.url)
        }
    });
    const [fieldValues, setFieldValues] = useState(Object.keys(boardColumns).reduce((acc, key) => {
        const acceptedTypes = ["url", "title", "text", "rich_text", "number", "date", "select", "multi_select"]
        // @ts-ignore
        if (acceptedTypes.includes(boardColumns[key]["type"])) return ({...acc, [key]: ""})
        else return ({...acc})
    }, {}))

    return (
        <>
            <button onClick={() => goTo(JobTrackingBoard)}>&larr; Back</button>
            <h3>Save to {boardName}</h3>
            <form onSubmit={e => {
                e.preventDefault();
                console.log(fieldValues)
            }}>
                <table>
                    <tbody>
                    { fieldValues? Object.keys(fieldValues).map(key => {
                        // @ts-ignore
                        const type: string = boardColumns[key]["type"]
                        // @ts-ignore
                        const inputField = createInputField(key, type, fieldValues, setFieldValues, (type == "url"? activeTabURL: fieldValues[key]), (type == "select" || type == "multi_select"? boardColumns[key]["select"] || boardColumns[key]["multi_select"] : undefined));

                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{inputField}</td>
                            </tr>)
                }):null}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <input type="button" name="cancel" value="Cancel"/>
                        </td>
                        <td>
                            <input type="submit" name="save_job" value="Save Job"/>
                        </td>
                    </tr>
                </tfoot>
            </table>
            </form>
        </>
    )
}

export default SaveJobPost;
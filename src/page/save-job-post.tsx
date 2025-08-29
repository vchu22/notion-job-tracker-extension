import React, {useState} from "react";
import CreatableSelect from 'react-select/creatable';
import { goTo } from 'react-chrome-extension-router';
import JobTrackingBoard from "./job-tracking-board";
import {useAppContext} from "../app-context";

const typeInputs = {
    "title": (name:string, values: {[key:string]: any}, setValues: any) => <input type="text" id={name} name={name} value={values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>,
    "date": (name:string, values: {[key:string]: any}, setValues: any) => <input type="date" id={name} name={name} value={values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>,
    "number": (name:string, values: {[key:string]: any}, setValues: any) => <input type="number" id={name} name={name} value={values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>,
    "url": (name:string, values: {[key:string]: any}, setValues: any, tabURL?: string) => <input type="url" id={name} name={name} value={tabURL || values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>,
    "rich_text": (name:string, values: {[key:string]: any}, setValues: any) => <textarea id={name} name={name} value={values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>,
    "select": (name:string, opt: { options: Array<{ id: string, name: string, [key: string]: any } >
}, values: {[key:string]: any}, setValues: any) => {
        const options = opt["options"].map(o => {return {value: o["name"], label: o["name"]}});
        return <CreatableSelect isClearable={false} options={options} onChange={(val) => setValues({...values, [name]: val})}/>;
    },
    "multi_select": (name:string, opt: { options: Array<{ id: string, name: string, [key: string]: any } >
}, values: {[key:string]: any}, setValues: any) => {
        const options = opt["options"].map(o => {return {value: o["name"], label: o["name"]}});
        return <CreatableSelect isMulti isClearable={false} options={options} onChange={(val) => setValues({...values, [name]: val})} />;
    },
}

function SaveJobPost() {
    const {boardName, boardColumns} = useAppContext()
    const columnNames = Object.keys(boardColumns);
    const [activeTabURL, setActiveTabURL] = useState("")
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
        if (tab && typeof tab.url === 'string') {
            setActiveTabURL(tab.url)
        }
    });
    const [fieldValues, setFieldValues] = useState(Object.keys(boardColumns).reduce((acc, key) => {return ({...acc, [key]: ""})}, {}))

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
                    { columnNames.map(key => {
                        // @ts-ignore
                        const type: string = boardColumns[key]["type"]
                        // @ts-ignore
                        const elemFunc = typeInputs[type];
                        if (elemFunc != undefined) {
                            // @ts-ignore
                            const elem = type == "select" || type == "multi_select"? elemFunc(key, boardColumns[key]["select"] || boardColumns[key]["multi_select"], fieldValues, setFieldValues) : (type=="url"? elemFunc(key, fieldValues, setFieldValues, activeTabURL): elemFunc(key, fieldValues, setFieldValues));
                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{elem}</td>
                                </tr>)
                        }
                })}
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
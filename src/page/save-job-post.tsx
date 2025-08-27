import React from "react";
import { goTo } from 'react-chrome-extension-router';
import JobTrackingBoard from "./job-tracking-board";
import {useAppContext} from "../app-context";

const typeInputs = {
    "date": (name:string) => <input type="date" id={name} name={name}/>,
    "rich_text": (name:string) => <input type="text" id={name} name={name}/>,
    "url": (name:string) => <input type="url" id={name} name={name}/>,
    "number": (name:string) => <input type="number" id={name} name={name}/>,
    "title": (name:string) => <input type="text" id={name} name={name}/>,
    "select": (name:string, values: { options: Array<{ id: string, name: string, [key: string]: any } >
    }) => (<select name={name} id={name}>
            {values["options"].map(value => (
                    <option key={value["id"]} value={value["name"]}>{value["name"]}</option>))}
        </select>),
    "multi_select": (name:string, values: { options: Array<{ id: string, name: string, [key: string]: any } >
    }) => (<div id={name}>
            {values["options"].map(value => (<div key={value["id"]}>
                    <input type="checkbox" id={value["id"]} name={value["name"]} value={value["name"]}/>
                    <label htmlFor={value["name"]}>{value["name"]}</label><br/>
                </div>))}
        </div>),
}

function SaveJobPost() {
    const {boardName, boardColumns} = useAppContext()
    const columnNames = Object.keys(boardColumns);

    return (
        <>
            <button onClick={() => goTo(JobTrackingBoard)}>&larr; Back</button>
            <h3>Save to {boardName}</h3>
            <form>
                <table>
                    <tbody>
                    { columnNames.map(key => {
                    // @ts-ignore
                    const type: string = boardColumns[key]["type"]
                    // @ts-ignore
                    const elemFunc = typeInputs[type];
                    if (elemFunc != undefined) {
                        // @ts-ignore
                        const elem = type == "select" || type == "multi_select"? elemFunc(key, boardColumns[key]["select"] || boardColumns[key]["multi_select"]):elemFunc(key);
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
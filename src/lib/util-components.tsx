import CreatableSelect from "react-select/creatable";
import React from "react";

export const createInputField = (name:string, type: string, values: {[key:string]: any}, setValues: any, tabURL?: string, options?: { options: Array<{ id: string, name: string, [key: string]: any }>}) => {
    const opt = options? options["options"].map(o => {return {value: o["name"], label: o["name"]}}) : undefined;
    switch (type) {
        case "rich_text":
            return <textarea id={name} name={name} value={values[name]} onChange={(e) => setValues({...values, [name]: e.target.value})}/>
        case "select":
        case "multi_select":
            return <CreatableSelect isClearable={false} options={opt} onChange={(val) => setValues({...values, [name]: val})} isMulti={type == "multi_select"} />;
        default:
            return <input type={type == "title"? "text": type} id={name} name={name} value={values[name]}
                          onFocus={(e) => setValues({...values, [name]: e.target.value || tabURL})} onChange={(e) => setValues({...values, [name]: e.target.value})}/>;
    }
}
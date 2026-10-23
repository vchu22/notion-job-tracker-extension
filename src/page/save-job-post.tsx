import React, { useEffect, useState } from "react";
import { goTo } from 'react-chrome-extension-router';
import { initFieldValues, saveToDatabase } from '../lib/util-functions'
import { createInputField } from '../lib/util-components'
import JobTrackingBoard from "./job-tracking-board";
import { useAppContext } from "../app-context";

function SaveJobPost() {
    const { dataSourceId, apiKey, boardName, boardColumns } = useAppContext()
    const [activeTabURL, setActiveTabURL] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [fieldOrder, setFieldOrder] = useState<string[]>([])
    const [isFieldOrderLoaded, setIsFieldOrderLoaded] = useState(false)
    const [draggedField, setDraggedField] = useState<string | null>(null)
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
        if (tab && typeof tab.url === 'string') {
            setActiveTabURL(tab.url)
        }
    });
    const [fieldValues, setFieldValues] = useState(initFieldValues(boardColumns, activeTabURL))
    const fieldNames = Object.keys(fieldValues)
    const fieldNamesSignature = fieldNames.join("\0")
    const orderStorageKey = dataSourceId ? `fieldOrder:${dataSourceId}` : ""

    useEffect(() => {
        let cancelled = false
        setIsFieldOrderLoaded(false)

        if (!orderStorageKey) {
            setFieldOrder(fieldNames)
            setIsFieldOrderLoaded(true)
            return;
        }

        chrome.storage.local.get(orderStorageKey, result => {
            if (cancelled) return
            if (chrome.runtime.lastError) {
                console.error("Failed to load saved field order:", chrome.runtime.lastError);
                setErrorMessage(`Could not load the saved field order: ${chrome.runtime.lastError.message}`)
                setFieldOrder(fieldNames)
                setIsFieldOrderLoaded(true)
                return;
            }

            const savedOrder = result[orderStorageKey]
            const validSavedFields = Array.isArray(savedOrder)
                ? savedOrder.filter((key): key is string => typeof key === "string" && fieldNames.includes(key))
                : []
            setFieldOrder([
                ...new Set(validSavedFields),
                ...fieldNames.filter(key => !validSavedFields.includes(key))
            ])
            setIsFieldOrderLoaded(true)
        })

        return () => {
            cancelled = true
        }
    }, [orderStorageKey, fieldNamesSignature])

    const persistFieldOrder = (nextOrder: string[]) => {
        setFieldOrder(nextOrder)
        if (!orderStorageKey) return

        chrome.storage.local.set({ [orderStorageKey]: nextOrder }, () => {
            if (chrome.runtime.lastError) {
                console.error("Failed to save field order:", chrome.runtime.lastError);
                setErrorMessage(`Could not save the field order: ${chrome.runtime.lastError.message}`)
            }
        })
    }

    const moveField = (field: string, targetIndex: number) => {
        const sourceIndex = fieldOrder.indexOf(field)
        if (!isFieldOrderLoaded || sourceIndex < 0 || targetIndex < 0 || targetIndex >= fieldOrder.length || sourceIndex === targetIndex) return

        const nextOrder = [...fieldOrder]
        nextOrder.splice(sourceIndex, 1)
        nextOrder.splice(targetIndex, 0, field)
        // the order will be stored in the local storage for the next time the user uses it
        persistFieldOrder(nextOrder)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        const invalidOption = fieldOrder.find(key => {
            // @ts-ignore
            return boardColumns[key]["type"] === "multi_select"
                // @ts-ignore
                && Array.isArray(fieldValues[key])
                // @ts-ignore
                && fieldValues[key].some(option => !option.id && String(option.label || option.value).includes(","));
        });
        if (invalidOption) {
            setErrorMessage(`The new "${invalidOption}" option contains a comma, which Notion does not allow. Choose an existing option or remove the comma.`);
            return;
        }

        const properties = fieldOrder.reduce((acc, key) => {
            // @ts-ignore
            if (fieldValues[key] == "") return ({ ...acc });

            let val;
            // @ts-ignore
            switch (boardColumns[key]["type"]) {
                case "title":
                case "rich_text":
                    // @ts-ignore
                    val = [{ text: { content: fieldValues[key] } }]; break;
                case "number":
                    // @ts-ignore
                    val = Number.parseFloat(fieldValues[key]); break;
                case "date":
                    // @ts-ignore
                    val = { start: fieldValues[key] }; break;
                case "select":
                    // @ts-ignore
                    val = { name: fieldValues[key]["value"] }; break;
                case "multi_select":
                    // @ts-ignore
                    val = fieldValues[key].map(option => option.id ? { id: option.id } : { name: option.label || option.value }); break;
                default:
                    // @ts-ignore
                    val = fieldValues[key]
            }
            return ({ ...acc, [key]: val })
        }, {})

        setIsSaving(true);
        try {
            await saveToDatabase(dataSourceId, apiKey, properties);
            goTo(JobTrackingBoard);
        } catch (error) {
            console.error("Failed to save job to Notion:", error);
            setErrorMessage(error instanceof Error ? error.message : "Could not save the job to Notion.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h3><button onClick={() => goTo(JobTrackingBoard)}>&larr;</button>Save to {boardName}</h3>
                <p>Drag the ⠿ handle to reorder fields. Your order is saved for next time, but resets if you reinstall the extension.</p>
                {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
                <table>
                    <tbody>
                        {fieldValues ? fieldOrder.map(key => {
                            // @ts-ignore
                            const type: string = boardColumns[key]["type"]
                            // @ts-ignore
                            const inputField = createInputField(key, type, fieldValues, setFieldValues, (type == "url" ? activeTabURL : fieldValues[key]), (type == "select" || type == "multi_select" ? boardColumns[key]["select"] || boardColumns[key]["multi_select"] : undefined));

                            return (
                                <tr
                                    key={key}
                                    onDragOver={event => event.preventDefault()}
                                    onDrop={event => {
                                        event.preventDefault()
                                        if (draggedField) moveField(draggedField, fieldOrder.indexOf(key))
                                        setDraggedField(null)
                                    }}
                                    draggable={isFieldOrderLoaded}
                                    onDragStart={event => {
                                        setDraggedField(key)
                                        event.dataTransfer.effectAllowed = "move"
                                    }}
                                    onDragEnd={() => setDraggedField(null)}
                                    style={{ cursor: isFieldOrderLoaded ? "grab" : "default" }}
                                >
                                    <td className="w-1/5">
                                        <span
                                            draggable={isFieldOrderLoaded}
                                            aria-label={`Drag to reorder ${key}`}
                                            title="Drag to reorder"
                                            style={{ cursor: isFieldOrderLoaded ? "grab" : "default" }}
                                        >⠿</span>
                                        {" "}{key}
                                    </td>
                                    <td className="w-full">{inputField}</td>
                                </tr>)
                        }) : null}
                    </tbody>
                </table>
                <div className="flex flex-row justify-end">
                    <input type="button" value="Clear" onClick={() => setFieldValues(initFieldValues(boardColumns, activeTabURL))} />
                    <input type="button" value="Cancel" onClick={() => goTo(JobTrackingBoard)} />
                    <input type="submit" name="save_job" value={isSaving ? "Saving..." : "Save Job"} disabled={isSaving || !isFieldOrderLoaded} />
                </div>
            </form>
        </>
    )
}

export default SaveJobPost;
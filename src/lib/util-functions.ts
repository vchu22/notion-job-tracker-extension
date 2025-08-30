export const initFieldValues = (boardColumns: object, activeTabURL: string) => Object.keys(boardColumns).reduce((acc, key) => {
    const acceptedTypes = ["title", "text", "rich_text", "number", "date", "select", "multi_select"]
    // @ts-ignore
    const type: string = boardColumns[key]["type"]
    if (acceptedTypes.includes(type)) return ({...acc, [key]: ""})
    else if (type == "url") return ({...acc, [key]: activeTabURL})
    else return ({...acc})
}, {});

export const getDatabaseStructure = (
    databaseId:string, apiKey:string, setBoardName:any, setBoardIcon:any, setBoardColumns:any,
    setErrorMessage?:React.Dispatch<React.SetStateAction<string>>, setShowError?:React.Dispatch<React.SetStateAction<boolean>>) => {
    return fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
            'Authorization': `Bearer ${apiKey}`,
        }
    }).then((response) => response.json())
        .then((data) => {
            // Handle the fetched data here
            if (data.status) {       // if server returns any error status code
                if (setErrorMessage) {
                    setErrorMessage(data.message);
                }
                if (setShowError) {
                    setShowError(true);
                }
            } else {
                if (setErrorMessage) {
                    setErrorMessage("");
                }
                if (setShowError) {
                    setShowError(false);
                }
                setBoardName(data["title"][0]["plain_text"]); // Notion page title
                setBoardIcon(data["icon"]["external"]["url"]);
                setBoardColumns(data["properties"]);
            }
        })
        .catch(error => {
            // Handle any errors
            console.log("Error: ", error)
            if (setErrorMessage) {
                setErrorMessage("Cannot connect: " + error)
            }
            if (setShowError) {
                setShowError(true);
            }
        });
}
export const initFieldValues = (boardColumns: object, activeTabURL: string) => Object.keys(boardColumns).reduce((acc, key) => {
    const acceptedTypes = ["title", "text", "rich_text", "number", "date", "select", "multi_select"]
    // @ts-ignore
    const type: string = boardColumns[key]["type"]
    if (acceptedTypes.includes(type)) return ({...acc, [key]: ""})
    else if (type == "url") return ({...acc, [key]: activeTabURL})
    else return ({...acc})
}, {});
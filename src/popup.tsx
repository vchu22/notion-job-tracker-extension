import React from "react";
import { createRoot } from "react-dom/client";

const version : number = 0;
function Popup() {
    return (
        <div>
            <h1>Hello, world!</h1>
            <p>This is a simple popup.</p>
            <b>Version {version+1}</b>
        </div>
    )
}
const container = document.getElementById('app')!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Popup/>);
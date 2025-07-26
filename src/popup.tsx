import React from "react";
import { createRoot } from "react-dom/client";
import CredentialsInput from './page/credentials-input'
import {AppProvider} from "./app-context";

function Popup() {
    return (
        <AppProvider>
            <div>
                <CredentialsInput></CredentialsInput>
            </div>
        </AppProvider>
    )
}
const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(<Popup/>);
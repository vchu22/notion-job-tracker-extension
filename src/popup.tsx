import React from "react";
import { createRoot } from "react-dom/client";
import CredentialsInputPage from './page/credentials-input'
import WelcomePage from './page/welcome'

import {AppProvider} from "./app-context";
import './tailwind.css';
import './popup.css';

function Popup() {
    return (
        <AppProvider>
            <>
                <WelcomePage/>
                {/*<CredentialsInputPage></CredentialsInputPage>*/}
            </>
        </AppProvider>
    )
}
const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(<Popup/>);
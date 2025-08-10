import React, {useEffect, useState} from "react";
import { createRoot } from "react-dom/client";
import { Router } from 'react-chrome-extension-router';
import WelcomePage from './page/welcome'
import CredentialsInputPage from './page/credentials-input'

import { AppProvider } from "./app-context";
import { loadSettings } from "./lib/settings";
import './tailwind.css';
import './popup.css';

function Popup() {
    const [skipWelcome, setSkipWelcome] = useState(false);
    useEffect(() => {
        loadSettings(["skipWelcome"]).then(result => {
            setSkipWelcome(result["skipWelcome"])
        })
    }, [setSkipWelcome])
    return (
        <AppProvider>
            <div className="content-wrapper">
                <Router>
                    {skipWelcome? <CredentialsInputPage/>: <WelcomePage/>}
                </Router>
            </div>
        </AppProvider>
    )
}

const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(<Popup/>);
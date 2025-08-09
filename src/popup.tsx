import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from 'react-chrome-extension-router';
import CredentialsInputPage from './page/credentials-input'
import WelcomePage from './page/welcome'

import { AppProvider, useAppContext } from "./app-context";
import './tailwind.css';
import './popup.css';

function Popup() {
    return (
        <AppProvider>
            <div className="content-wrapper">
                <Router>
                    <WelcomePage/>
                </Router>
            </div>
        </AppProvider>
    )
}

const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(<Popup/>);
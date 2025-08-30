import React, {useEffect, useState} from "react";
import { createRoot } from "react-dom/client";
import { Router } from 'react-chrome-extension-router';
import WelcomePage from './page/welcome'
import CredentialsInputPage from './page/credentials-input'
import {AppProvider, useAppContext} from "./app-context";
import { MainPage } from './lib/util-consts';
import { loadSettings } from "./lib/settings";
import './tailwind.css';
import './popup.css';
import JobTrackingBoard from "./page/job-tracking-board";
import {loadCredentials} from "./lib/db-credentials";

function Popup() {
    const [mainPage, setMainPage] = useState(MainPage.Welcome);
    useEffect(() => {
        loadSettings(["mainPage"]).then(result => {
            setMainPage(result["mainPage"])
        })
    }, [setMainPage])
    return (
        <AppProvider>
            <ContentWrapper mainPage={mainPage}/>
        </AppProvider>
    )
}

const ContentWrapper = ({mainPage} : {mainPage: MainPage}) => {
    const { setDatabaseId, setApiKey } = useAppContext();
    useEffect(() => {
        loadCredentials()
            .then((result) => {
                if (result.databaseId) setDatabaseId(result.databaseId);
                if (result.apiKey) setApiKey(result.apiKey);
            })
            .catch((error) => {
                console.error('Failed to load credentials:', error);
            });
    }, [setDatabaseId, setApiKey])
    return (<div className="content-wrapper">
        <Router>
            {mainPage == MainPage.JobTrackingBoard? <JobTrackingBoard/>: (mainPage == MainPage.CredentialInput? <CredentialsInputPage/>: <WelcomePage/>)}
        </Router>
    </div>)
}

const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(<Popup/>);
import React from "react";
import { goTo } from 'react-chrome-extension-router';
import CredentialsSetupPage from './credentials-setup';
import { saveSettings } from "../lib/settings";
import { MainPage } from "../lib/util-consts";

function WelcomePage() {
    const handleClick = async () => {
        await saveSettings({ mainPage: MainPage.CredentialsSetup });
        goTo(CredentialsSetupPage);
    }
    return (
        <>
            <h2>Welcome to Notion Job Tracker!</h2>
            <p>This is a Chrome extension that allows you to add job posts to your Notion and track your job applications using Notion databases.</p>
            <button onClick={handleClick}>Get Started</button>
        </>
    )
}

export default WelcomePage;
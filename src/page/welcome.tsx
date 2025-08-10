import React from "react";
import { goTo } from 'react-chrome-extension-router';
import CredentialsInputPage from './credentials-input';
import {saveSettings} from "../lib/settings";

function WelcomePage() {
    const handleClick = async () => {
        await saveSettings({skipWelcome: true});
        goTo(CredentialsInputPage);
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
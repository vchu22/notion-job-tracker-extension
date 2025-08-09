import React from "react";
import { useAppContext } from "../app-context";
import { saveCredentials, loadCredentials } from "../lib/storage";

function WelcomePage() {
    const { setFirstTimeRun } = useAppContext()
    const handleClick = () => {
        setFirstTimeRun(false);
    }
    return (
        <form>
            <h2>Welcome to Notion Job Tracker!</h2>
            <p>This is a Chrome extension that allows you to add job posts to your Notion and track your job applications using Notion databases.</p>
            <button onClick={handleClick}>Get Started</button>
        </form>
    )
}

export default WelcomePage;
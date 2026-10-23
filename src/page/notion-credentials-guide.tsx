import React from "react";
import { goTo } from "react-chrome-extension-router";
import CredentialsSetupPage from "./credentials-setup";

function NotionCredentialsGuide() {
    return (
        <div className="credentials-guide">
            <h3>Connect your Notion database</h3>
            <p>To get started, find your database link and create a Notion token. This guide walks you through both.</p>

            <h4>1. Copy your database ID</h4>
            <ol>
                <li>In Notion, open the database as a full page, then use its menu to choose <strong>Copy link</strong>.</li>
                <li>
                    In the copied link, find the database's long ID. It is usually the 32-character string at the end of the address
                    (sometimes shown with hyphens). For example, in <code>notion.so/Jobs-a1b2c3d4e5f6478890abcdef12345678?v=...</code>,
                    the ID is <code>a1b2c3d4e5f6478890abcdef12345678</code>.
                </li>
                <li>Copy only that ID, not the workspace or database name, the rest of the link, or anything after <code>?v=</code>, and paste it into <strong>Database ID</strong>.</li>
            </ol>

            <h4>2. Create your API key</h4>
            <ol>
                <li>Sign in to Notion and go to the workspace that contains your database.</li>
                <li>
                    Open <a href="https://www.notion.so/developers/tokens" target="_blank" rel="noreferrer">Notion's token page</a> and click on <strong>New token</strong>.
                </li>
                <li>Give the token a name, and make sure to enable the <strong>Notion API</strong> capability.</li>
                <li>Create the token and copy it. Notion won't show it again.</li>
                <li>You'll paste it into the extension's <strong>API Key</strong> field.</li>
            </ol>

            <p><strong>Keep your token private.</strong> It lets the extension access Notion content available to your account. Don't send it to anyone or post it publicly.</p>
            <p>Back in the extension, enter both values and select <strong>Connect</strong>. If your database has more than one data source, choose where new job entries should go.</p>
            <button onClick={() => goTo(CredentialsSetupPage)}>Back to connection</button>
        </div>
    );
}

export default NotionCredentialsGuide;

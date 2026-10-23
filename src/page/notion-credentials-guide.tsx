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
                <li>Log on to your Notion, and open the page for your job tracker Notion database.
                </li>
                <li>
                    <p>In the URL of the page, copy the database ID, which is shown after the last <code>/</code> and before the <code>?v=</code>. For example, in <code>app.notion.com/p/a1b2c3d4e5f6478890abcdef12345678?v=...</code>, the ID is <code>a1b2c3d4e5f6478890abcdef12345678</code>.
                    </p>
                    <img src="img/Guide_dbID_Step_2.png" width="100%" />
                </li>
                <li>
                    <p>Paste it into the <strong>Database ID</strong> field in this extension.</p>
                    <img src="img/Guide_dbID_Step_3.png" width="100%" />
                </li>
            </ol>

            <h4>2. Create your API key</h4>
            <ol>
                <li>Sign in to Notion and go to the workspace that contains your database.</li>
                <li>
                    <p>Open <a href="https://www.notion.so/developers/tokens" target="_blank" rel="noreferrer">Notion's token page</a> and click on <strong>New token</strong>.</p>
                    <img src="img/Guide_APIKey_Step_2.png" width="100%" />
                </li>
                <li>
                    <p>Give the token a name, and make sure to enable the <strong>Notion API</strong> capability.</p>
                    <img src="img/Guide_APIKey_Step_3.png" width="100%" />
                </li>
                <li>
                    <p>Create the token and copy it. Notion won't show it again.</p>
                    <img src="img/Guide_APIKey_Step_4.png" width="100%" />
                </li>
                <li>
                    <p>You'll paste it into the extension's <strong>API Key</strong> field.</p>
                    <img src="img/Guide_APIKey_Step_5.png" width="100%" />
                </li>
            </ol>

            <p><strong>Keep your token private.</strong> It lets the extension access Notion content available to your account. Don't send it to anyone or post it publicly.</p>
            <p>Back in the extension, enter both values and select <strong>Connect</strong>. If your database has more than one data source, choose where new job entries should go.</p>
            <button onClick={() => goTo(CredentialsSetupPage)}>Back to connection</button>
        </div >
    );
}

export default NotionCredentialsGuide;

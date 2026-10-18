# Notion Job Tracker - Chrome Extension
A job tracker extension that uses Notion as the backend to store your job tracking info.

## Run the code
#### Prerequisites
- Install [Node.js](https://nodejs.org/), which includes npm.

#### Install dependencies and build
From the project directory, install the dependencies once:
- `npm install`

Then run one of these commands to generate or update the `dist` folder containing your Chrome extension files:
- Run development mode: `npm run dev`
- Run production mode: `npm run build`

Development mode watches for source changes. Keep its terminal running while you work.

#### Initial setup
Do this once. You only need to repeat it if you remove the extension or want to load it in another Chrome profile.

1. Enter `chrome://extensions` in the URL bar or go to `Settings > Extensions`, and enable **Developer mode**.
2. Click **Load unpacked** and select this repo's `dist` folder.

When connecting a Notion database with multiple data sources, choose the data source where job entries should be created.

#### After setup
For later changes, run `npm run dev` or `npm run build` as needed. When the build finishes, click the **Reload icon** for the extension on the Extensions page, then reopen the popup.

To inspect the extension popup using Chrome DevTools, replace `<extension_id>` in `chrome-extension://<extension_id>/popup.html` with your extension’s ID shown in chrome://extensions, open the resulting URL in Chrome, then open DevTools.
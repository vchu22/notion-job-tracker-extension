# Notion Job Tracker - Chrome Extension
A job tracker extension that uses Notion as the backend to store your job tracking info.

## Run the code
#### Terminal Commands
Run one of the commands to generate a `dist` folder containing your Chrome extension files:
- Run development mode: `npm run dev`
- Run production mode: `npm run build`

#### Instructions
When running the extension for the first time, enable the "Developer mode" on Chrome Extensions Settings page. Then, click on the "Load unpacked" button on the top, navigate to the project folder, and select the "dist" folder inside your project's directory. This will install the extension on your Chrome browser.

After enabling your extension, click on the extension list button in the top right corner and click on the extension you just installed. You should see a popup with the content specified in `src/popup.tsx`. Edit and save `src/popup.tsx` and run one of the above terminal commands to see the changes reflected on your extension.

To debug the popup page in Chrome Dev Tool, type in `chrome-extension://<extension_id>/popup.html` in the URL bar. `<extension_id>` can be found in the Chrome Extensions Settings page.
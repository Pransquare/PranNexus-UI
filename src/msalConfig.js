// src/msalConfig.js

import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: "540d854f-c10a-4072-a571-0446ed7d7826", // Replace with your client ID
        authority: "https://login.microsoftonline.com/9ec212c2-2f63-4e82-a59a-5e479388ba2a", // Replace with your tenant ID
        redirectUri: "http://localhost:3004", // Redirect to the root
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;

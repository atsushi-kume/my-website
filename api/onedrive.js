const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID",
        authority: "https://login.microsoftonline.com/consumers/",
        redirectUri: "https://atsushi-kume.github.io/my-website/"
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

async function login() {
    await msalInstance.loginPopup({
        scopes: ["Files.ReadWrite", "User.Read"]
    });
    alert("ログイン成功");
}

async function getToken() {
    const account = msalInstance.getAllAccounts()[0];
    const resp = await msalInstance.acquireTokenSilent({
        account: account,
        scopes: ["Files.ReadWrite", "User.Read"]
    });
    return resp.accessToken;
}

async function listFiles() {
    const token = await getToken();

    const res = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
        headers: { Authorization: "Bearer " + token }
    });

    const json = await res.json();
    document.getElementById("result").innerText =
        JSON.stringify(json, null, 2);
}

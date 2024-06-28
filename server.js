const express = require("express");
const { ConfidentialClientApplication } = require("@azure/msal-node");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all routes

const msalConfig = {
  auth: {
    clientId: "a679867c-ab59-4542-b293-dfafad073c4e", // Replace with your client ID
    authority:
      "https://login.microsoftonline.com/d1e4eca3-158f-4f70-b22d-1f26864393a0", // Replace with your tenant ID
    clientSecret: "Fja8Q~qHPdh3JTowAmAl-2gI8v84ifUoOFXBFa9~", // Replace with your client secret value
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

app.get("/getToken", async (req, res) => {
  const clientCredentialRequest = {
    scopes: ["https://graph.microsoft.com/.default"], // Request for Graph API scope
  };

  try {
    const response = await cca.acquireTokenByClientCredential(
      clientCredentialRequest
    );
    res.json({ accessToken: response.accessToken });
  } catch (error) {
    console.error("Error acquiring token:", error.message);
    console.error(error.stack);
    res.status(500).json({
      message: "Error acquiring token",
      error: error.message,
      stack: error.stack,
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const express = require("express");
const { ConfidentialClientApplication } = require("@azure/msal-node");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use PORT from .env file or default to 3000

app.use(cors()); // Enable CORS for all routes

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: process.env.AUTHORITY,
    clientSecret: process.env.CLIENT_SECRET,
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

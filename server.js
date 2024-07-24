const express = require("express");
const { ConfidentialClientApplication } = require("@azure/msal-node");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use PORT from .env file or default to 3000

app.use(
  cors({
    origin: "https://sea-turtle-app-eodm2.ondigitalocean.app", // Allow only your frontend URL
  })
);

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: process.env.AUTHORITY,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

app.get("/getToken/msal", async (req, res) => {
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

app.get("/getToken/axios", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.AUTHORITY}/oauth2/v2.0/token`,
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        },
      }
    );

    res.json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error("Error getting token:", error);
    res.status(500).send("Error getting token");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

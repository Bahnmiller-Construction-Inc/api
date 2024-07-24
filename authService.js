require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "https://sea-turtle-app-eodm2.ondigitalocean.app", // Allow only your frontend URL
  })
);

app.get("/getToken", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

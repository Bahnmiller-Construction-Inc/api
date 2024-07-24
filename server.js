const express = require("express");
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

app.get("/getToken", async (req, res) => {
  try {
    console.log("AUTHORITY:", process.env.AUTHORITY);
    console.log("CLIENT_ID:", process.env.CLIENT_ID);
    console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);

    const params = new URLSearchParams();
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", "https://graph.microsoft.com/.default");
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      `${process.env.AUTHORITY}/oauth2/v2.0/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error(
      "Error getting token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error getting token");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

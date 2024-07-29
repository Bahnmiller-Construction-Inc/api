const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const qs = require("qs");

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001; // Use PORT from .env file or default to 3001

app.use(
  cors({
    origin: [
      "https://sea-turtle-app-eodm2.ondigitalocean.app",
      "http://localhost:3000",
    ], // Allow both your production and local development frontend URLs
  })
);

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route to get Raken token
app.get("/getRakenToken", async (req, res) => {
  try {
    const data = qs.stringify({
      client_id: process.env.RAKEN_CLIENT_ID,
      client_secret: process.env.RAKEN_CLIENT_SECRET,
      grant_type: "client_credentials",
      code: process.env.CODE,
    });

    const response = await axios.post(
      "https://app.rakenapp.com/oauth/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error(
      "Error getting Raken token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error getting Raken token");
  }
});

app.get("/getToken", async (req, res) => {
  try {
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });

    const response = await axios.post(
      `${process.env.AUTHORITY}/oauth2/v2.0/token`,
      data,
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

app.post("/uploadFile", async (req, res) => {
  try {
    const accessToken = await getToken();
    const driveId =
      "b!5KywVeEld0y8NNhDfG0uXN-CacW2b1ZAs6PS9EVImUauWERqyueNQaOSRvZafpFk";
    const pyrlFolderId = "01A2EJU32WPY7QDKJLZVDY7RJLV5AVMXLB";

    const newHireFolder = await findFolder(
      accessToken,
      driveId,
      pyrlFolderId,
      "00-New Hire Paperwork"
    );

    if (newHireFolder) {
      // Create a different dummy file for upload testing
      const fileContent = "This is a different test file.";
      const buffer = Buffer.from(fileContent, "utf8");
      const uploadResponse = await uploadFile(
        accessToken,
        driveId,
        newHireFolder.id,
        "different-testfile.txt",
        buffer
      );
      res.json({ uploadResponse });
    } else {
      res.status(404).send("00-New Hire Paperwork folder not found.");
    }
  } catch (error) {
    console.error(
      "Error uploading file:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error uploading file");
  }
});

const getToken = async () => {
  const data = qs.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await axios.post(
    `${process.env.AUTHORITY}/oauth2/v2.0/token`,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

const findFolder = async (accessToken, driveId, parentFolderId, folderName) => {
  const response = await axios.get(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${parentFolderId}/children`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const folder = response.data.value.find(
    (item) => item.name === folderName && item.folder
  );
  return folder;
};

const uploadFile = async (
  accessToken,
  driveId,
  parentFolderId,
  fileName,
  fileBuffer
) => {
  const response = await axios.put(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${parentFolderId}:/${fileName}:/content`,
    fileBuffer,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "text/plain",
      },
    }
  );

  return response.data;
};

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

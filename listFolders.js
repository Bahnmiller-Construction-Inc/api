const axios = require("axios");
const { getToken } = require("./authService");

// Function to list folder contents for a specific drive
const listFolders = async (driveId) => {
  try {
    const accessToken = await getToken();
    console.log("Access Token:", accessToken);

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/drives/${driveId}/root/children`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Folders:", response.data);
  } catch (error) {
    console.error("Error listing folders:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    }
  }
};

// Replace with your actual drive ID obtained from the listDrives function
const driveId = "your-drive-id";
listFolders(driveId);

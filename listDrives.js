const axios = require("axios");
const { getToken } = require("./authService");

// Function to list drives for a specific site
const listDrives = async (siteId) => {
  try {
    const accessToken = await getToken();
    console.log("Access Token:", accessToken);

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Drives:", response.data);
  } catch (error) {
    console.error("Error listing drives:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    }
  }
};

// Replace with your actual site ID obtained from the listSites function
const siteId = "your-site-id";
listDrives(siteId);

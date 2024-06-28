const axios = require("axios");
const { getToken } = require("./authService");

// Function to list all sites
const listSites = async () => {
  try {
    const accessToken = await getToken();
    console.log("Access Token:", accessToken);

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites?search=*`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Sites:", response.data);
  } catch (error) {
    console.error("Error listing sites:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    }
  }
};

listSites();

const axios = require("axios");

const getAccessToken = async () => {
  try {
    const response = await axios.get("http://localhost:3001/getToken");
    console.log("Access Token:", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("Error getting token:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    }
    throw new Error("Error getting token");
  }
};

const listUsers = async () => {
  try {
    const accessToken = await getAccessToken();
    console.log("Access Token:", accessToken); // Log the access token for debugging
    const response = await axios.get("https://graph.microsoft.com/v1.0/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Users:", response.data);
  } catch (error) {
    console.error("Error listing users:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    }
  }
};

listUsers();

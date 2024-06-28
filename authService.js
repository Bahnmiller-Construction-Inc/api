const axios = require("axios");

const getToken = async () => {
  try {
    const response = await axios.get("http://localhost:3001/getToken");
    return response.data.accessToken;
  } catch (error) {
    console.error("Error getting token:", error);
    throw new Error("Error getting token");
  }
};

module.exports = { getToken };

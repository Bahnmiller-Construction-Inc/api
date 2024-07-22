import axios from "axios";

export const getToken = async () => {
  try {
    const response = await axios.get("http://209.38.64.234:3001/getToken"); // Use the correct port if it's different
    return response.data.accessToken;
  } catch (error) {
    console.error("Error getting token:", error);
    throw new Error("Error getting token");
  }
};

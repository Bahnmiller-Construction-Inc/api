import axios from "axios";

export const getToken = async () => {
  try {
    const response = await axios.get(
      "https://sea-turtle-app-eodm2.ondigitalocean.app/getToken"
    );
    return response.data.accessToken;
  } catch (error) {
    console.error("Error getting token:", error);
    throw new Error("Error getting token");
  }
};

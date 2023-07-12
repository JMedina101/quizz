import axios from "axios";

export const fetchQuestionaire = async () => {
  try {
    const response = await axios.get("/api/payload.json");
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch");
  }
};

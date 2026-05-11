import axios from "./axios";

export const getActiveOrchards = async () => {
  try {
    const res = await axios.get("/api/orchards", { 
      params: { status: "active" } 
    });
    // For non-paginated requests, it returns { orchards: [...] }
    return res.data.orchards || [];
  } catch (error) {
    console.error("Error fetching orchards:", error);
    return [];
  }
};

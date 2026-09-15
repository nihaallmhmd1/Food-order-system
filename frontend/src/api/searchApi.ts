import API_BASE_URL from "./api";

export const searchAll = async (query: string) => {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Search failed");
  }

  return data;
};
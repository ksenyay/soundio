import axios from "axios";

export const buildClient = (jwtToken?: string) => {
  if (!jwtToken && typeof window !== "undefined") {
    jwtToken = localStorage.getItem("jwt") || "";
  }
  return axios.create({
    headers: {
      Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
    },
  });
};

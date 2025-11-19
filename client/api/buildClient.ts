import axios from "axios";

export const buildClient = (sessionCookie?: string) => {
  if (!sessionCookie && typeof document !== "undefined") {
    sessionCookie = document.cookie;
  }
  return axios.create({
    headers: {
      cookie: sessionCookie ? `session=${sessionCookie}` : "",
    },
  });
};

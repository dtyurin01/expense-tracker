import ky from "ky";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",

  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error;

        if (typeof window !== "undefined") {
          if (
            response &&
            response.status === 401 &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/login?expired=true";
          }
        }

        return error;
      },
    ],
  },
});

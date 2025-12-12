import ky from "ky";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5072",

  credentials: "include", // send cookies with requests

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
            const currentPath = window.location.pathname;

            const targetUrl = `/login?expired=true&callbackUrl=${encodeURIComponent(
              currentPath
            )}`;

            window.location.href = targetUrl;
          }
        }

        return error;
      },
    ],
  },
});

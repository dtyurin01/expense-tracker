import { HTTPError } from "ky";

export async function getErrorMessage(error: unknown): Promise<string> {
  const shouldLog = process.env.NODE_ENV !== "production";
  if (shouldLog) console.error(error);

  if (error instanceof HTTPError) {
    const status = error.response.status;

    if (status === 401) return "Invalid credentials or session expired.";
    if (status === 403)
      return "You do not have permission to perform this action.";
    if (status === 500) return "Server error. Please try again later.";

    try {
      const errorData = await error.response.json();

      if (Array.isArray(errorData) && errorData[0]?.description) {
        return errorData[0].description;
      }

      if (errorData.message) {
        return errorData.message;
      }
    } catch {
      return error.response.statusText || "Request failed";
    }
  }

  if (error instanceof Error) {
    if (
      error.message === "Failed to fetch" ||
      error.message.includes("NetworkError") ||
      error.message.includes("connection refused")
    ) {
      return "Cannot connect to server. Is the API running?";
    }

    return error.message;
  }

  return "An unexpected error occurred.";
}

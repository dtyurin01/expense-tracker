import { HTTPError } from "ky";

export async function getErrorMessage(error: unknown): Promise<string> {
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
    return error.message;
  }

  return "An unexpected error occurred.";
}

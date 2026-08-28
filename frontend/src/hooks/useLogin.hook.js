import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

// Simulated function to post data to an API endpoint
const loginUser = async (user) => {
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  let response;
  try {
    response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  } catch (err) {
    throw new Error(
      "Unable to connect to the backend server. Please make sure the server is running."
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = "Login failed. Please check your credentials and try again.";

    if (errorData?.error) {
      if (typeof errorData.error === "string") {
        errorMessage = errorData.error;
      } else if (Array.isArray(errorData.error) && errorData.error.length > 0) {
        errorMessage = errorData.error[0]?.msg || errorData.error[0]?.message || errorMessage;
      } else if (errorData.error.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.error.reason) {
        errorMessage = errorData.error.reason;
      }
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.reason) {
      errorMessage = errorData.reason;
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

// Custom hook for posting todos
export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const accessToken = response?.accessToken ?? response?.data?.accessToken;

      if (!accessToken) {
        console.error("No access token received from server:", response);
        return;
      }

      Cookies.set("token", accessToken, { expires: 1 });
      Cookies.set(
        "user",
        JSON.stringify({
          firstname: response?.firstname ?? response?.data?.firstname,
          lastname: response?.lastname ?? response?.data?.lastname,
          email: response?.email ?? response?.data?.email,
          role: response?.role ?? response?.data?.role,
        }),
        { expires: 1 }
      );
    },
    onError: (error) => {
      // Handle error case
      console.error("Error authenticating:", error);
    },
  });
}
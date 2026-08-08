import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

// Simulated function to post data to an API endpoint
const loginUser = async (user) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Network response was not ok");
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
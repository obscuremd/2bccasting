import axios from "axios";
import { jwtDecode } from "jwt-decode";

export async function Auth({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ message: string; status: "success" | "error" }> {
  try {
    const response = await axios.post("/api/user?action=authenticate", {
      email,
      password,
    });
    return { message: response.data.message, status: "success" };
  } catch (error) {
    console.log(error);
    return { message: "Error Registering", status: "error" };
  }
}

export async function OtpVerify({
  code,
  email,
}: {
  code: number;
  email: string;
}): Promise<{ message: string; status: "success" | "error" }> {
  try {
    const response = await axios.post("/api/user?action=verify-otp", {
      code,
      email,
    });

    console.log("OtpVerify response:", response);

    // ✅ store token if returned
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return { message: response.data.message, status: "success" };
  } catch (error) {
    console.log(error);
    return { message: "Error Registering", status: "error" };
  }
}
export async function GetProfiles(): Promise<{
  message: string;
  status: "success" | "error";
  data: HomeUsers[];
}> {
  try {
    const response = await axios.get("/api/user?portfolio=random");
    // ✅ store token if returned
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return {
      message: response.data.message,
      status: "success",
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return { message: "Error Registering", status: "error", data: [] };
  }
}

interface DecodedToken {
  id: string;
  exp: number; // expiry timestamp
}

export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem("auth_token");
  console.log(token);

  if (!token) {
    console.log("no token");
    return null;
  }

  try {
    // 1. Decode token
    const decoded = jwtDecode<DecodedToken>(token);

    // 2. Check expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("auth_token");
      return null;
    }

    // 3. Use decoded.id to fetch user
    const response = await axios.get(`/api/user?id=${decoded.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      return response.data as User;
    }

    localStorage.removeItem("auth_token");
    return null;
  } catch (error) {
    console.error("Token validation failed:", error);
    localStorage.removeItem("auth_token");
    return null;
  }
}

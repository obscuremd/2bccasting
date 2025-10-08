import axios, { AxiosError } from "axios";
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
}): Promise<{ message: string; status: "success" | "error" | "pending" }> {
  try {
    const response = await axios.post("/api/user?action=verify-otp", {
      code,
      email,
    });

    console.log("OtpVerify response:", response);
    if (response.data.user === false && response.status === 200) {
      localStorage.setItem("auth_token", response.data.token);
      return { message: "Oops you dont have an account", status: "pending" };
    }

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

export async function Register({
  email,
  phone_number,
  password,
  fullname,
  bio,
  gender,
  location,
  category,
  date_of_birth,
  profile_picture,
  role,
}: {
  email: string;
  phone_number: string;
  password: string;
  fullname: string;
  bio: string;
  gender: string;
  location: string;
  category: string;
  date_of_birth: string;
  profile_picture: string;
  role: string;
}): Promise<{ message: string; status: "success" | "error" }> {
  // ✅ Basic validation
  if (
    !email.trim() ||
    !phone_number.trim() ||
    !password.trim() ||
    !fullname.trim() ||
    !bio.trim() ||
    !gender ||
    !location ||
    !date_of_birth ||
    (category === "talent" && !role) ||
    (category === "scout" && !profile_picture)
  ) {
    return {
      message: "All fields must be filled",
      status: "error",
    };
  }
  try {
    const response = await axios.post("/api/user?action=register", {
      email,
      phone_number,
      password,
      fullname,
      bio,
      gender,
      location,
      category,
      date_of_birth,
      profile_picture,
      role,
    });

    if (response.status === 200) {
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

      return {
        message: response.data.message,
        status: "success",
      };
    } else {
      return {
        message: response.data.message,
        status: "error",
      };
    }
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    if (error.response?.data?.message) {
      return {
        message: error.response.data.message,
        status: "error",
      };
    }

    return {
      message: "Unexpected error",
      status: "error",
    };
  }
}

export async function GetProfiles(): Promise<{
  message: string;
  status: "success" | "error";
  data: HomeUsers[];
}> {
  try {
    const response = await axios.get("/api/user?portfolio=random");
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
  id?: string;
  user: boolean;
  email: string;
  exp: number; // expiry timestamp
}

export async function getCurrentUser(): Promise<{
  user: User | null;
  status: "success" | "error" | "pending";
}> {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return { user: null, status: "error" };
  }

  try {
    // 1. Decode token
    const decoded = jwtDecode<DecodedToken>(token);

    // 2. Check expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("auth_token");
      return { user: null, status: "error" };
    }

    // 3. Handle pending registration
    if (decoded.user === false) {
      return { user: null, status: "pending" };
    }

    // 4. Fetch user by ID
    if (!decoded.id) {
      return { user: null, status: "error" };
    }

    const response = await axios.get(`/api/user?id=${decoded.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      return { user: response.data as User, status: "success" };
    }

    localStorage.removeItem("auth_token");
    return { user: null, status: "error" };
  } catch (error) {
    console.error("Token validation failed:", error);
    localStorage.removeItem("auth_token");
    return { user: null, status: "error" };
  }
}

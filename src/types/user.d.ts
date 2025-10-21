interface AuthData {
  email: string;
  password: string;
  purpose?: "login" | "forgot_password";
}

interface OtpData {
  email: string;
  code: number;
  purpose?: "login" | "forgot_password";
  createdAt: Date;
}

interface RegisterData {
  email: string;
  password: string;
  fullname: string;
  bio: string;
  gender: string;
  location: string;
  category: string;
  date_of_birth: string;
}

// types/User.ts

interface User {
  _id: string; // comes from MongoDB
  email: string;
  phone_number: string;
  password: string;
  profile_picture?: string; // optional since not required
  fullname: string;
  bio: string;
  gender: "male" | "female";
  location: string;
  category: "talent" | "scout";
  date_of_birth: Date;

  saved_profiles: [];

  // Talent-specific fields
  role?: string;
  portfolio_pictures: string[];
  cv?: string;
  vip?: boolean;

  vip_start_date?: Date;
  vip_end_date?: Date;
  profile_visibility: boolean;

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

interface HomeUsers {
  _id: string;
  fullname: string;
  role: string;
  picture: string;
  location: string;
  gender: string;
  age: number;
}

interface AuthData {
  email: string;
  password: string;
}

interface OtpData {
  email: string;
  code: number;
  createdAt: Date;
}

// types/User.ts

interface User {
  _id: string; // comes from MongoDB
  email: string;
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

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

interface HomeUsers {
  _id: string;
  fullname: string;
  role: string;
  picture: string;
  age: number;
}

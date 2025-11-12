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

interface Flyer {
  _id: string;
  userId: string;
  flyer_image?: string;
  company_name: string;
  profession: string;
  skills: string;
  education: string;
  gender: "male" | "female";
  location: string;
  project_begin: Date;
  project_end: Date;
  amount?: string;
  description?: string[];
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

  flyer?: Flyer[];

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

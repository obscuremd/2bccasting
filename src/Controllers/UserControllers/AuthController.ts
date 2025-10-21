import { sendMail } from "@/lib/mailService";
import { Otp } from "@/Models/OtpModel";
import { User } from "@/Models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function authenticate(data: AuthData) {
  // Default purpose to "login" if not specified
  const purpose = data.purpose || "login";

  // ✅ Validate purpose
  const validPurposes = ["login", "forgot_password"];
  if (!validPurposes.includes(purpose)) {
    return { message: "Invalid purpose specified", status: 400 };
  }

  if (!data.email) return { message: "Email Missing", status: 400 };

  const email = data.email.toLocaleLowerCase();

  const user = await User.findOne({ email });

  if (purpose === "login") {
    if (!data.password) return { message: "Password Missing", status: 400 };
    if (user) {
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) return { message: "Invalid credentials", status: 401 };
    }
  }

  if (purpose === "forgot_password" && !user) {
    return { message: "Invalid credentials", status: 401 };
  }

  // delete old OTP
  await Otp.deleteOne({ email });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ code, email });

  const subject =
    purpose === "forgot_password" ? "Password Reset Code" : "Your OTP Code";

  await sendMail(
    email,
    subject,
    `Your OTP is <b>${code}</b>. It will expire in 5 minutes.`
  );

  return {
    message:
      purpose === "forgot_password"
        ? "A password reset code has been sent to your email"
        : "A six-digit OTP has been sent to your email",
    status: 200,
  };
}

export async function verifyOtp(data: OtpData) {
  // Default purpose to "login" if not specified
  const purpose = data.purpose || "login";

  // ✅ Validate purpose
  const validPurposes = ["login", "forgot_password"];
  if (!validPurposes.includes(purpose)) {
    return { message: "Invalid purpose specified", status: 400 };
  }

  if (!data.code || !data.email)
    return { message: "Missing fields", status: 400 };

  const email = data.email.toLowerCase();

  const usersOtp = await Otp.findOne({ email });
  if (!usersOtp) return { message: "Invalid OTP", status: 401 };

  // check expiry
  const expiryTime = new Date(usersOtp.createdAt.getTime() + 5 * 60 * 1000);
  if (new Date() > expiryTime) {
    await Otp.deleteOne({ email });
    return { message: "OTP expired", status: 400 };
  }

  // compare code
  if (data.code !== usersOtp.code) {
    return { message: "Invalid OTP", status: 401 };
  }

  const user = await User.findOne({ email });
  await Otp.deleteOne({ email });
  if (!user) {
    const token = jwt.sign(
      { user: false, email },
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
      { expiresIn: "2d" }
    );
    return {
      message: "User not found, please register",
      token: token,
      status: 200,
      user: false,
    };
  }

  if (purpose === "forgot_password") {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        message: "password reset pending",
      },
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    return {
      message: "OTP Verified. You can now reset your password",
      token,
      status: 200,
    };
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      category: user.category,
      role: user.role,
    },
    process.env.NEXT_PUBLIC_JWT_SECRET as string,
    { expiresIn: "2d" }
  );

  return {
    message: "Otp Verified successfully",
    token: token,
    status: 200,
    user: true,
  };
}

export async function register(data: User) {
  // list of required fields from your schema
  const requiredFields: (keyof RegisterData)[] = [
    "email",
    "password",
    "fullname",
    "bio",
    "gender",
    "location",
    "category",
    "date_of_birth",
  ];

  // check for missing fields
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    return {
      message: `Missing required fields: ${missingFields.join(", ")}`,
      status: 400,
    };
  }

  // normalize email to lowercase
  const email = data.email.toLowerCase();

  // check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return { message: "User already exists", status: 400 };

  // hash password and create user
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, email, password: hashedPassword });

  // cleanup otp if exists
  await Otp.deleteOne({ email });

  // generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      category: user.category,
      role: user.role,
    },
    process.env.NEXT_PUBLIC_JWT_SECRET as string,
    { expiresIn: "2d" }
  );

  return { message: "User registered", status: 201, token };
}

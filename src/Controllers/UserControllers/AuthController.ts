import { sendMail } from "@/lib/mailService";
import { Otp } from "@/Models/OtpModel";
import { User } from "@/Models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function authenticate(data: AuthData) {
  if (!data.email || !data.password)
    return { message: "Missing Fields", status: 400 };

  const user = await User.findOne({ email: data.email });

  if (user) {
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) return { message: "Invalid credentials", status: 401 };
  }

  // delete old OTP
  await Otp.deleteOne({ email: data.email });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ code, email: data.email });

  await sendMail(
    data.email,
    "Your OTP Code",
    `Your OTP is <b>${code}</b>. It will expire in 5 minutes.`
  );

  return {
    message: "A six-digit OTP has been sent to your email",
    status: 200,
  };
}

export async function verifyOtp(data: OtpData) {
  if (!data.code || !data.email)
    return { message: "Missing fields", status: 400 };

  const usersOtp = await Otp.findOne({ email: data.email });
  if (!usersOtp) return { message: "Invalid OTP", status: 401 };

  // check expiry
  const expiryTime = new Date(usersOtp.createdAt.getTime() + 5 * 60 * 1000);
  if (new Date() > expiryTime) {
    await Otp.deleteOne({ email: data.email });
    return { message: "OTP expired", status: 400 };
  }

  // compare code
  if (data.code !== usersOtp.code) {
    return { message: "Invalid OTP", status: 401 };
  }

  const user = await User.findOne({ email: data.email });
  await Otp.deleteOne({ email: data.email });
  if (!user) {
    const token = jwt.sign(
      { user: false, email: data.email },
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
  const requiredFields = [
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
  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof AuthData]
  );
  if (missingFields.length > 0) {
    return {
      message: `Missing required fields: ${missingFields.join(", ")}`,
      status: 400,
    };
  }

  const existing = await User.findOne({ email: data.email });
  if (existing) return { message: "User already exists", status: 400 };

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword });

  // cleanup otp if exists
  await Otp.deleteOne({ email: data.email });

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

  return { message: "User registered", status: 201, token: token };
}

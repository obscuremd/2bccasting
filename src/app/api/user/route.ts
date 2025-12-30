/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  authenticate,
  register,
  verifyOtp,
} from "@/Controllers/UserControllers/AuthController";
import { connectMongoDb } from "@/lib/mongoDb";
import { User } from "@/Models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  await connectMongoDb();
  const action = req.nextUrl.searchParams.get("action");
  const data = await req.json();

  switch (action) {
    case "authenticate":
      return NextResponse.json(await authenticate(data));

    case "register":
      return NextResponse.json(await register(data));

    case "verify-otp":
      return NextResponse.json(await verifyOtp(data));

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await connectMongoDb();

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const fullname = searchParams.get("fullname");
  const portfolio = searchParams.get("portfolio");
  const role = searchParams.get("role") || "talent";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    // Get by ID
    if (id) {
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    }

    // Search by fullname
    if (fullname) {
      const users = await User.find({
        fullname: { $regex: fullname, $options: "i" },
        profile_visibility: true,
      }).sort({ fullname: 1 });
      return NextResponse.json(users, { status: 200 });
    }

    if (portfolio === "ordered") {
      const skip = (page - 1) * limit;

      const results = await User.aggregate([
        {
          // ✅ Only visible users with profile pictures
          $match: {
            category: role,
            profile_visibility: true,
            profile_picture: { $exists: true, $ne: "" },
          },
        },

        // ✅ Sort by newest accounts FIRST
        { $sort: { createdAt: -1 } },

        // ✅ Pagination (now stable)
        { $skip: skip },
        { $limit: limit },

        // ✅ Shape response for frontend
        {
          $project: {
            _id: 1,
            fullname: 1,
            role: "$category",
            location: 1,
            gender: 1,
            picture: "$profile_picture",
            date_of_birth: 1,
          },
        },

        // ✅ Compute age
        {
          $addFields: {
            age: {
              $dateDiff: {
                startDate: "$date_of_birth",
                endDate: "$$NOW",
                unit: "year",
              },
            },
          },
        },

        // ✅ Remove DOB from final payload
        {
          $project: {
            date_of_birth: 0,
          },
        },
      ]);

      return NextResponse.json(
        {
          data: results,
          page,
          limit,
          nextPage: results.length === limit ? page + 1 : null,
        },
        { status: 200 }
      );
    }

    // Default: all users (only visible)
    const users = await User.find({ profile_visibility: true }).sort({
      fullname: 1,
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectMongoDb();

  try {
    const body = await req.json();
    const {
      id,
      portfolio_pictures_add, // pictures to add
      portfolio_pictures_remove, // pictures to remove
      portfolio_pictures_replace, // replace full array
      password,
      ...updates
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updateQuery: Record<string, any> = { $set: updates };

    /** ---------------- Portfolio Pictures ---------------- **/
    // Replace the entire portfolio
    if (portfolio_pictures_replace) {
      updateQuery.$set = {
        ...updates,
        portfolio_pictures: portfolio_pictures_replace,
      };
    }

    // Add new pictures
    if (portfolio_pictures_add && portfolio_pictures_add.length > 0) {
      updateQuery.$push = {
        ...(updateQuery.$push as object),
        portfolio_pictures: { $each: portfolio_pictures_add },
      };
    }

    // Remove specific pictures
    if (portfolio_pictures_remove && portfolio_pictures_remove.length > 0) {
      updateQuery.$pull = {
        ...(updateQuery.$pull as object),
        portfolio_pictures: { $in: portfolio_pictures_remove },
      };
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery.$set.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (password) {
      const token = jwt.sign(
        {
          id: updatedUser._id,
          email: updatedUser.email,
          category: updatedUser.category,
          role: updatedUser.role,
        },
        process.env.NEXT_PUBLIC_JWT_SECRET as string,
        { expiresIn: "2d" }
      );

      return NextResponse.json(
        {
          message: "Password updated successfully",
          token,
          user: updatedUser,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectMongoDb();

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully", user: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

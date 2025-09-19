import {
  authenticate,
  register,
  verifyOtp,
} from "@/Controllers/UserControllers/AuthController";
import { connectMongoDb } from "@/lib/mongoDb";
import { User } from "@/Models/UserModel";
import { NextRequest, NextResponse } from "next/server";

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
  const saved = searchParams.get("saved"); // 👈 new query param

  try {
    // Get by ID
    if (id && !saved) {
      const user = await User.findById(id).populate("saved_profiles");

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    }

    // Get saved profiles for a user
    if (id && saved === "true") {
      const user = await User.findById(id).populate("saved_profiles");
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user.saved_profiles, { status: 200 });
    }

    // Get by fullname (case-insensitive match)
    if (fullname) {
      const users = await User.find({
        fullname: { $regex: fullname, $options: "i" },
      });
      return NextResponse.json(users, { status: 200 });
    }

    // Get random portfolio pictures for homepage
    if (portfolio === "random") {
      const results = await User.aggregate([
        {
          $match: {
            category: "talent",
            portfolio_pictures: { $exists: true, $ne: [] },
          },
        },
        { $unwind: "$portfolio_pictures" }, // one doc per picture
        { $sample: { size: 20 } }, // randomly pick 20
        {
          $project: {
            picture: "$portfolio_pictures", // rename field
            fullname: 1,
            role: 1,
            age: {
              $dateDiff: {
                startDate: "$date_of_birth",
                endDate: "$$NOW",
                unit: "year",
              },
            },
          },
        },
      ]);

      return NextResponse.json(results, { status: 200 });
    }

    // Default: return all users
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
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
      saved_profiles_add, // saved profiles to add
      saved_profiles_remove, // saved profiles to remove
      saved_profiles_replace, // replace saved profiles array
      ...updates
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updateQuery: Record<string, unknown> = { $set: updates };

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

    /** ---------------- Saved Profiles ---------------- **/
    // Replace the entire saved_profiles array
    if (saved_profiles_replace) {
      updateQuery.$set = {
        ...(typeof updateQuery.$set === "object" && updateQuery.$set !== null
          ? updateQuery.$set
          : {}),
        saved_profiles: saved_profiles_replace,
      };
    }

    // Add new saved profiles
    if (saved_profiles_add && saved_profiles_add.length > 0) {
      updateQuery.$push = {
        ...(updateQuery.$push as object),
        saved_profiles: { $each: saved_profiles_add },
      };
    }

    // Remove specific saved profiles
    if (saved_profiles_remove && saved_profiles_remove.length > 0) {
      updateQuery.$pull = {
        ...(updateQuery.$pull as object),
        saved_profiles: { $in: saved_profiles_remove },
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

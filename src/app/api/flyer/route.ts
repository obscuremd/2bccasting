/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectMongoDb } from "@/lib/mongoDb";
import { Flyer } from "@/Models/FlyerModel";
import { User } from "@/Models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDb();

    const {
      userId,
      flyer_image,
      company_name,
      profession,
      skills,
      education,
      gender,
      location,
      project_begin,
      project_end,
      amount,
      description,
    } = await req.json();

    // ✅ Check user existence
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Count existing flyers by this user
    const flyerCount = await Flyer.countDocuments({ userId });

    // 🚫 Enforce posting limits
    if (!user.vip && flyerCount >= 1) {
      return NextResponse.json(
        {
          message:
            "Posting limit reached. Upgrade to VIP to create more than one flyer.",
        },
        { status: 403 }
      );
    }

    if (user.vip && flyerCount >= 3) {
      return NextResponse.json(
        {
          message:
            "VIP posting limit reached. You can only have up to 3 flyers.",
        },
        { status: 403 }
      );
    }

    // ✅ Create new flyer
    const newFlyer = await Flyer.create({
      userId,
      flyer_image,
      company_name,
      profession,
      skills,
      education,
      gender,
      location,
      project_begin,
      project_end,
      amount,
      description,
    });

    return NextResponse.json(
      { message: "Flyer created successfully", flyer: newFlyer },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating flyer:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDb();
    const params = req.nextUrl.searchParams;

    const type = params.get("type");
    const id = params.get("id");

    // ✅ Fetch all flyers
    if (type === "all") {
      const data = await Flyer.find();
      return NextResponse.json(
        { message: "Flyers fetched", data },
        { status: 200 }
      );
    }

    // ✅ Fetch flyers for a specific user
    if (type === "user") {
      if (!id) {
        return NextResponse.json(
          { message: "User ID is required when type=user" },
          { status: 400 }
        );
      }
      const data = await Flyer.find({ userId: id });
      return NextResponse.json(
        { message: "Flyers fetched", data },
        { status: 200 }
      );
    }

    // ✅ Fetch a single flyer by ID
    if (type === "single") {
      if (!id) {
        return NextResponse.json(
          { message: "Flyer ID is required when type=single" },
          { status: 400 }
        );
      }

      const flyer = await Flyer.findById(id);
      if (!flyer) {
        return NextResponse.json(
          { message: "Flyer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Flyer fetched", flyer },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid request. Valid types: all, user, single" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error fetching flyers:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectMongoDb();

    const { id, ...updatedFields } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Flyer ID is required" },
        { status: 400 }
      );
    }

    const updatedFlyer = await Flyer.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedFlyer) {
      return NextResponse.json({ message: "Flyer not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Flyer updated successfully", flyer: updatedFlyer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating flyer:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectMongoDb();
    const params = req.nextUrl.searchParams;
    const id = params.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Flyer ID is required" },
        { status: 400 }
      );
    }

    const deletedFlyer = await Flyer.findByIdAndDelete(id);

    if (!deletedFlyer) {
      return NextResponse.json({ message: "Flyer not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Flyer deleted successfully", flyer: deletedFlyer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting flyer:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

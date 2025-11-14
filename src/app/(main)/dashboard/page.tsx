/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CustomCard from "@/components/local/card";
import LocationSelect from "@/components/local/countryselect";
import { DatePicker } from "@/components/local/datePicker";
import ImageUploadUi from "@/components/local/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/lib/ApiService";
import { uploadImages } from "@/lib/UtilServices";
import { faker } from "@faker-js/faker";
import axios from "axios";
import {
  DoorOpen,
  Download,
  Eye,
  EyeClosed,
  Loader2Icon,
  Trash,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // dialog control
  const [images, setImages] = useState<string[]>([]);
  const [flyers, setFlyers] = useState<Flyer[]>([]);

  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  const [dialog, setDialog] = useState({ state: false, value: "" });

  const getAge = (dob: Date) => {
    const diff = Date.now() - dob.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  useEffect(() => {
    async function GetUser() {
      setLoading(true);
      try {
        const response = await getCurrentUser();
        if (response.user === null) {
          toast.error("Unauthorized");
          router.push("/");
          return;
        }
        setData(response.user);
        console.log("role:", response.user.role);
      } finally {
        setLoading(false);
      }
    }
    GetUser();
  }, []);

  useEffect(() => {
    if (data?.category === "talent") {
      setImages(data.portfolio_pictures || []);
    } else {
      async function getFlyers() {
        const res = await axios.get<{ data: Flyer[] }>(
          `/api/flyer?type=user&id=${data?._id}`
        );
        setFlyers(res.data.data);
      }
      getFlyers();
    }
  }, [data]);

  function Logout() {
    localStorage.removeItem("auth_token");
    router.push("/");
  }

  async function setProfileVisibilty() {
    setProfileUpdateLoading(true);
    try {
      if (!data) {
        return;
      }
      const res = await axios.put("/api/user", {
        id: data._id,
        profile_visibility: !data?.profile_visibility,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully");
        console.log("response:", res);
        const updatedUser = await getCurrentUser();
        setData(updatedUser.user);
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unknown error");
    } finally {
      setProfileUpdateLoading(false);
    }
  }

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[10px]">
      {/* Hero Section */}

      {/* dialog */}
      <Dialog
        open={dialog.state}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, state: open }))}
      >
        {dialog.value === "upload_pictures" && (
          <UploadImage data={data} setUser={setData} setModal={setDialog} />
        )}
        {dialog.value === "post_flyer" && (
          <PostFlyerModal data={data} setUser={setData} setModal={setDialog} />
        )}
        {dialog.value === "delete_profile" && data != null && (
          <DeleteModal data={data} setModal={setDialog} />
        )}
      </Dialog>

      {/* Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <EditProfile user={data} setUser={setData} />
      </Sheet>

      <div className="w-full flex flex-col md:flex-row items-center gap-8">
        <CustomCard image={data?.profile_picture} profile={true} />

        <div className=" flex flex-col gap-8">
          {/* profile info */}

          <div className="flex flex-col gap-2">
            {/* profile & buttons */}
            <div className="flex flex-col md:flex-row w-full gap-4 items-start md:items-center">
              <p className="text-h3 font-semibold capitalize">
                {data?.fullname}
              </p>
              <div className="flex gap-2">
                <Button variant={"secondary"} onClick={() => setIsOpen(true)}>
                  Edit Profile
                </Button>
                {data?.vip === false && (
                  <Button onClick={() => router.push("/vip")}>
                    🌟 Become a Vip
                  </Button>
                )}
              </div>
            </div>
            <p className="capitalize text-title1 font-semibold">
              {data?.category === "scout" ? "Recruiter" : data?.role}
            </p>
            <p>{data?.bio}</p>
          </div>

          <p>
            {data?.vip ? (
              <>
                You are a VIP member. Your VIP subscription started on{" "}
                <span className="font-semibold">
                  {data?.vip_start_date
                    ? new Date(data.vip_start_date).toLocaleDateString()
                    : "N/A"}
                </span>{" "}
                and will end on{" "}
                <span className="font-semibold text-red-500">
                  {data?.vip_end_date
                    ? new Date(data.vip_end_date).toLocaleDateString()
                    : "N/A"}
                </span>
                .
              </>
            ) : (
              "UPGRADE TO VIP: Your phone Number and Email will appear on your profile web interface. You talk and transact directly with Recruiters to get paid, you  keep all benefits and also see who viewed or saved your profile."
            )}
          </p>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <p>Email: {data?.email}</p>

            <p>
              Age:{" "}
              {data?.date_of_birth
                ? getAge(new Date(data.date_of_birth))
                : "N/A"}{" "}
              Years Old
            </p>
            <p>Gender: {data?.gender}</p>
            <p>
              State:{" "}
              {data?.location?.includes(",")
                ? data.location.split(", ")[0]
                : "—"}
            </p>
            <p>
              Country:{" "}
              {data?.location?.includes(",")
                ? data.location.split(", ")[1]
                : data?.location}
            </p>
            <p>Phone Number: {data?.phone_number}</p>
          </div>

          <div className="flex w-[50%] gap-2">
            <Button
              onClick={() =>
                setDialog((p) => ({
                  ...p,
                  state: true,
                  value:
                    data?.category === "scout"
                      ? "post_flyer"
                      : "upload_pictures",
                }))
              }
              className="w-full"
            >
              <Upload />
              {data?.category === "talent" ? "Upload Picture" : "Post Flyer"}
            </Button>

            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={setProfileVisibilty}
              variant={data?.profile_visibility ? "secondary" : "default"}
              disabled={profileUpdateLoading}
            >
              {profileUpdateLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : data?.profile_visibility ? (
                <>
                  <EyeClosed className="w-4 h-4" />
                  <span>Make Profile Invisible</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Make Profile Visible</span>
                </>
              )}
            </Button>
          </div>
          <div className="flex w-[50%] gap-2">
            <Button onClick={Logout} variant={"secondary"} className="w-full">
              <DoorOpen /> Logout
            </Button>
            <Button
              onClick={() =>
                setDialog((p) => ({
                  ...p,
                  state: true,
                  value: "delete_profile",
                }))
              }
              variant={"destructive"}
              className="w-full"
            >
              <Trash /> Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Portfolio / Flyers */}
      <div className="flex items-center gap-2 mt-10 w-full">
        <hr className="flex-1 border-gray-400" />
        <p className="text-h3 font-semibold">
          {data?.category === "talent"
            ? `Portfolio (${images.length})`
            : `Flyers (${flyers.length})`}
        </p>
        <hr className="flex-1 border-gray-400" />
      </div>

      {/* ✅ Cards Section */}
      <div className="columns-1 sm:columns-2 lg:columns-5 gap-6 w-full">
        {data?.category === "talent" ? (
          images.length > 0 ? (
            images.map((pic, i) => (
              <CustomCard key={i} image={pic} profile={true} />
            ))
          ) : (
            <p>No Portfolio Pictures</p>
          )
        ) : flyers.length > 0 ? (
          flyers.map((f, i) => (
            <CustomCard
              key={i}
              image={f.flyer_image}
              primary_text={f.profession}
              secondary_text={f.company_name}
            />
          ))
        ) : (
          <p>No Flyers Yet</p>
        )}
      </div>
    </div>
  );
}

function EditProfile({
  user,
  setUser,
}: {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const roles = [
    "Actor",
    "Model",
    "Hostess",
    "Voice Over Artist",
    "Fashion Designer",
    "Presenter",
    "Influencer",
    "Script Writer",
    "Movie Producer",
    "Movie Director",
    "Graphics Designer",
    "Web Developer",
    "Digital Marketer",
    "Cinematographer",
    "Event Planner",
    "Driver",
  ];

  const [data, setData] = useState({
    email: "",
    password: "",
    fullname: "",
    bio: "",
    gender: "",
    location: "",
    category: "",
    date_of_birth: "",
    role: "",
  });

  /** 🖼️ Upload profile picture to Firebase */
  const handleProfileUpload = async () => {
    if (!profilePicture) {
      toast.error("Please select an image to upload.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadImages([profilePicture]);
      if (response.message === "success") {
        const imageUrl = response.data[0];

        // Update user’s profile picture in the database
        const res = await axios.put("/api/user", {
          id: user?._id,
          profile_picture: imageUrl,
        });

        if (res.status === 200) {
          toast.success("Profile picture updated successfully!");
          const updatedUser = await getCurrentUser();
          setUser(updatedUser.user);
          setProfilePicture(null);
        } else {
          toast.error("Error updating profile picture");
        }
      } else {
        toast.error("Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  /** ✏️ Save other profile changes */
  const saveChanges = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value && value.trim() !== ""
        )
      );

      if (Object.keys(filteredData).length === 0) {
        toast.error("Please fill at least one field before saving.");
        setLoading(false);
        return;
      }

      const res = await axios.put("/api/user", {
        id: user._id,
        ...filteredData,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully");
        const updatedUser = await getCurrentUser();
        setUser(updatedUser.user);
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-scroll">
        {/* 🖼️ Profile Picture Upload */}
        <div className="flex flex-col items-center gap-3">
          <Label>Profile Picture</Label>
          <div className="w-24 h-24 rounded-full overflow-hidden border">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : user?.profile_picture || "/placeholder.jpg"
              }
              alt="Profile preview"
              className="object-cover w-full h-full"
            />
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] ?? null)}
          />

          <Button
            onClick={handleProfileUpload}
            disabled={uploading || !profilePicture}
            variant="secondary"
          >
            {uploading ? (
              <>
                <Loader2Icon className="animate-spin mr-2" /> Uploading...
              </>
            ) : (
              "Upload Profile Picture"
            )}
          </Button>
        </div>

        {/* ✏️ Other Profile Fields */}
        <Input
          placeholder="Email"
          className="w-full"
          onChange={(e) =>
            setData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <Input
          placeholder="Full Name"
          className="w-full"
          onChange={(e) =>
            setData((prev) => ({ ...prev, fullname: e.target.value }))
          }
        />
        <Select
          onValueChange={(value) => setData((p) => ({ ...p, gender: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="what's your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setData((p) => ({ ...p, role: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="what do you do" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((role, index) => (
                <SelectItem key={index} value={role.toLowerCase()}>
                  {role}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DatePicker
          date={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
          setDate={(e) =>
            setData((p) => ({ ...p, date_of_birth: e?.toString() ?? "" }))
          }
        />
        <LocationSelect
          value={data.location}
          onChange={(value) => setData((p) => ({ ...p, location: value }))}
        />
        <Textarea
          className="h-full"
          placeholder="Give us a brief description"
          onChange={(e) => setData((p) => ({ ...p, bio: e.target.value }))}
        />
      </div>

      <SheetFooter>
        <Button onClick={saveChanges} disabled={loading}>
          {loading ? <Loader2Icon className="animate-spin" /> : "Save changes"}
        </Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

function UploadImage({
  data,
  setUser,
  setModal,
}: {
  data: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setModal: React.Dispatch<
    React.SetStateAction<{ state: boolean; value: string }>
  >;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadPictures = async () => {
    setLoading(true);
    try {
      if (file === null) {
        toast.error("a file must be selected");
        return;
      }

      const response = await uploadImages([file]);

      if (response.message === "success") {
        const res = await axios.put("/api/user", {
          id: data?._id,
          portfolio_pictures_add: response.data,
        });

        if (res.status === 200) {
          toast.success("Portfolio created successfully");
          // 🔄 re-fetch updated user
          const updatedUser = await getCurrentUser();
          setFile(null);
          setUser(updatedUser.user);
          setModal((p) => ({ ...p, state: false, value: "" }));
        } else {
          toast.error("Error creating portfolio");
        }
      } else {
        toast.error("Error uploading pictures");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unknown error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent className="flex flex-col gap-10">
      <DialogHeader className="flex flex-col items-center">
        <DialogTitle>Upload to your portfolio</DialogTitle>
        <DialogDescription>
          you can add a studio photo to your portfolio
        </DialogDescription>
        <ImageUploadUi file={file} setFile={setFile} />
      </DialogHeader>

      <Button onClick={uploadPictures} className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2Icon className="animate-spin" />
            Please wait
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </DialogContent>
  );
}

function DeleteModal({
  data,
  setModal,
}: {
  data: User;
  setModal: React.Dispatch<
    React.SetStateAction<{ state: boolean; value: string }>
  >;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  async function deleteUser() {
    if (!reason.trim()) {
      toast.error("Please provide a reason for deleting your account.");
      return;
    }

    try {
      setLoading(true);

      // 🧹 1. Delete user from database
      await axios.delete(`/api/user?id=${data._id}`);

      // 📧 2. Send email notification
      await axios.post("/api/email", {
        to: "support@bccastings.com",
        subject: "User Account Deletion Notice",
        body: `
          User <b>${data.fullname}</b> (<a href="mailto:${data.email}">${data.email}</a>) 
          has deleted their account.<br/><br/>
          <b>Reason:</b> ${reason}
        `,
      });

      toast.success("Your account has been deleted. You will be missed 💔");
      setModal({ state: false, value: "" });
      router.push("/");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogContent className="flex flex-col gap-10">
      <DialogHeader className="flex flex-col items-center">
        <DialogTitle>Are you sure about that?</DialogTitle>
        <DialogDescription>
          We&apos;re sad to see you leave 😢 — could you tell us why you’re
          deleting your account?
        </DialogDescription>
      </DialogHeader>

      <Input
        placeholder="Tell us why..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={loading}
      />

      <div className="flex w-full gap-2">
        <Button
          onClick={() => setModal((p) => ({ ...p, state: false, value: "" }))}
          className="w-1/2"
          disabled={loading}
        >
          Go Back
        </Button>
        <Button
          onClick={deleteUser}
          variant="destructive"
          className="w-1/2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Please wait
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </DialogContent>
  );
}

function PostFlyerModal({
  data,
  setUser,
  setModal,
}: {
  data: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setModal: React.Dispatch<
    React.SetStateAction<{ state: boolean; value: string }>
  >;
}) {
  const [flyerData, setFlyerData] = useState({
    flyer_image: null as File | null,
    company_name: "",
    profession: "",
    skills: "",
    education: "",
    gender: "",
    location: "",
    project_begin: new Date(),
    project_end: new Date(),
    amount: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!data) return;
    const {
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
    } = flyerData;

    if (
      !flyer_image ||
      !company_name ||
      !profession ||
      !skills ||
      !education ||
      !gender ||
      !location
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Upload flyer image first
      const uploaded = await uploadImages([flyer_image]);
      if (uploaded.message !== "success") {
        toast.error("Image upload failed.");
        setLoading(false);
        return;
      }

      const flyerImgUrl = uploaded.data[0];

      // Post flyer to backend
      const res = await axios.post("/api/flyer", {
        userId: data._id,
        flyer_image: flyerImgUrl,
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

      if (res.status === 201) {
        toast.success("Flyer posted successfully!");
        const updatedUser = await getCurrentUser();
        setUser(updatedUser.user);
        setModal({ state: false, value: "" });
      } else {
        toast.error("Failed to post flyer.");
        console.log("error: ", res);
      }
    } catch (error: any) {
      console.error("Flyer creation error:", error);
      toast.error(error.message || "Unknown error posting flyer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="flex flex-col gap-8 max-h-[90vh] overflow-y-auto">
      <DialogHeader className="flex flex-col items-center">
        <DialogTitle>Post a New Flyer</DialogTitle>
        <DialogDescription>
          Create and share a flyer for your company’s next casting or project.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        {/* Image Upload */}
        <Label>Flyer Image</Label>
        <ImageUploadUi
          file={flyerData.flyer_image}
          setFile={(file) =>
            setFlyerData((p) => ({
              ...p,
              flyer_image: file as File | null, // ✅ explicit cast
            }))
          }
        />

        <Input
          placeholder="Company Name *"
          value={flyerData.company_name}
          onChange={(e) =>
            setFlyerData((p) => ({ ...p, company_name: e.target.value }))
          }
        />
        <Input
          placeholder="Profession (e.g. Model, Actor, Dancer) *"
          value={flyerData.profession}
          onChange={(e) =>
            setFlyerData((p) => ({ ...p, profession: e.target.value }))
          }
        />
        <Input
          placeholder="Skills (comma-separated) *"
          value={flyerData.skills}
          onChange={(e) =>
            setFlyerData((p) => ({ ...p, skills: e.target.value }))
          }
        />
        <Input
          placeholder="Education Level *"
          value={flyerData.education}
          onChange={(e) =>
            setFlyerData((p) => ({ ...p, education: e.target.value }))
          }
        />
        <div>
          <Label>Gender</Label>
          <select
            className="border border-gray-300 rounded-md p-2 w-full"
            value={flyerData.gender}
            onChange={(e) =>
              setFlyerData((p) => ({ ...p, gender: e.target.value }))
            }
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <LocationSelect
          value={flyerData.location}
          onChange={(val) => setFlyerData((p) => ({ ...p, location: val }))}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <Label>Project Begin</Label>
            <DatePicker
              date={flyerData.project_begin}
              setDate={(val) =>
                setFlyerData((p) => ({
                  ...p,
                  project_begin: (val as Date) || new Date(), // ✅ explicit cast
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Deadline</Label>

            <DatePicker
              date={flyerData.project_end}
              setDate={(val) =>
                setFlyerData((p) => ({
                  ...p,
                  project_end: (val as Date) || new Date(), // ✅ explicit cast
                }))
              }
            />
          </div>
        </div>
        <Input
          type="number"
          placeholder="Amount"
          max={999999999}
          value={flyerData.amount}
          onChange={(e) => {
            const value = e.target.value;

            // Prevent numbers beyond 999,999,999
            if (Number(value) > 999999999) return;

            // Always store as string
            setFlyerData((p) => ({ ...p, amount: value.toString() }));
          }}
        />

        <Textarea
          placeholder="Description"
          value={flyerData.description}
          onChange={(e) =>
            setFlyerData((p) => ({ ...p, description: e.target.value }))
          }
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2Icon className="animate-spin" /> Posting...
          </>
        ) : (
          "Post Flyer"
        )}
      </Button>
    </DialogContent>
  );
}

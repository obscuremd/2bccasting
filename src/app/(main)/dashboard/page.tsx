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

  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  const [imageEditOpen, setImageEditOpen] = useState(false);

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
      } finally {
        setLoading(false);
      }
    }
    GetUser();
  }, []);

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

  const images =
    data?.category === "scout" ? data.saved_profiles : data?.portfolio_pictures;

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[10px]">
      {/* Hero Section */}

      {/* dialog */}
      <Dialog open={imageEditOpen} onOpenChange={setImageEditOpen}>
        <UploadImage
          data={data}
          setUser={setData}
          setModal={setImageEditOpen}
        />
      </Dialog>

      {/* Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <EditProfile user={data} setUser={setData} />
      </Sheet>

      <div className="w-full flex flex-col md:flex-row items-center gap-8">
        <CustomCard image={data?.profile_picture} profile={true} />

        <div className="md:w-[40%] flex flex-col gap-8">
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
              {data?.category === "scout" ? data.role : data?.category}
            </p>
            <p>{data?.bio}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-8">
              <div className=" flex gap-2 items-center">
                <p className="text-title2 md:text-title1 font-bold">
                  {data?.portfolio_pictures.length}
                </p>
                <p className="text-body md:text-title2 font-medium text-nowrap">
                  Portfolio Pictures
                </p>
              </div>
              <div className=" flex gap-2 items-center">
                <p className="text-title2 md:text-title1 font-bold">22</p>
                <p className="text-body md:text-title2 font-medium text-nowrap">
                  Page Insights
                </p>
              </div>
              <div className=" flex gap-2 items-center">
                <p className="text-title2 md:text-title1 font-bold">14</p>
                <p className="text-body md:text-title2 font-medium text-nowrap">
                  Saves
                </p>
              </div>
            </div>
            {data?.vip ? (
              <p className="font-medium text-muted-foreground">
                🎉 Welcome, <span className="font-semibold">VIP Member</span>!{" "}
                {data.vip_start_date && data.vip_end_date ? (
                  <>
                    Your membership started on{" "}
                    <span className="font-semibold text-foreground">
                      {new Date(data.vip_start_date).toLocaleDateString()}
                    </span>{" "}
                    and will remain active until{" "}
                    <span className="font-semibold text-foreground">
                      {new Date(data.vip_end_date).toLocaleDateString()}
                    </span>
                    .
                  </>
                ) : (
                  "We’re setting up your VIP details. You’ll see your membership dates here soon."
                )}{" "}
                As a VIP, you can now see who has viewed or saved your profile
                and connect with them directly.
              </p>
            ) : (
              <p className="font-medium text-muted-foreground">
                Upgrade to <span className="font-semibold">VIP</span> to unlock
                exclusive benefits — see who’s viewed or saved your profile and
                connect with them instantly.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
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
            {data?.category === "talent" && (
              <Button onClick={() => setImageEditOpen(true)} className="w-full">
                <Upload /> Upload Picture
              </Button>
            )}

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
            <Button
              onClick={() => setImageEditOpen(true)}
              variant={"secondary"}
              className="w-full"
            >
              <DoorOpen /> Logout
            </Button>
            <Button variant={"destructive"} onClick={Logout} className="w-full">
              <Trash /> Delete Account
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 items-center w-full">
        <hr className="w-[100px] md:w-[244px] bg-foreground" />
        <p className="text-h3 font-semibold">Portfolio </p>
      </div>

      {/* Talent Cards */}
      <div className="columns-1 sm:columns-2 lg:columns-5 gap-6">
        {images && images.length > 0 ? (
          images.map((pic, i) => <CustomCard key={i} image={pic} profile />)
        ) : (
          <p>No Portfolio Pictures</p>
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

  const saveChanges = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // remove empty fields
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
        console.log("response:", res);
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

      <div className="grid flex-1 auto-rows-min gap-6 px-4">
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
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
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
          setModal(false);
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

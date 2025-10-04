"use client";
import CustomCard from "@/components/local/card";
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
import { faker } from "@faker-js/faker";
import axios from "axios";
import { Download, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // dialog control

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

  const images =
    data?.category === "scout" ? data.saved_profiles : data?.portfolio_pictures;

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[10px]">
      {/* Hero Section */}
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
                <p className="text-title2 md:text-title1 font-bold">14</p>
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
              ""
            ) : (
              <p className="font-medium text-muted-foreground">
                Upgrade to VIP to see who has viewed or saved your profile, and
                connect directly with them.
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
            <p>Country: {data?.location}</p>
            <p>State: {data?.location}</p>
          </div>
          <Button variant={"destructive"} onClick={Logout}>
            <Download /> Logoout
          </Button>
        </div>
      </div>

      <div className="flex gap-2.5 items-center w-full">
        <hr className="w-[100px] md:w-[244px] bg-foreground" />
        <p className="text-h3 font-semibold">Portfolio </p>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 xl:grid-cols-7 gap-12 [grid-template-rows:masonry]">
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

  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);

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

  React.useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);
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
        <Select
          onValueChange={(value) => setData((p) => ({ ...p, location: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="what's your location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countries.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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

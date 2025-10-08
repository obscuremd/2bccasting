"use client";

import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Register } from "@/lib/ApiService";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/local/datePicker";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadUi from "@/components/local/ImageUpload";
import { uploadImages } from "@/lib/UtilServices";
import { Button } from "@/components/ui/button";
import LocationSelect from "@/components/local/countryselect";

interface RegisterUser {
  email: string;
  phone_number: string;
  password: string;
  fullname: string;
  bio: string;
  gender: string;
  location: string;
  category: string;
  date_of_birth: string;
  profile_picture: File | null;
  role: string;
}

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<"talent" | "scout">("talent");
  const [data, setData] = useState<RegisterUser>({
    email: "",
    phone_number: "",
    password: "",
    fullname: "",
    bio: "",
    gender: "",
    location: "",
    category: category,
    date_of_birth: "",
    profile_picture: null,
    role: "",
  });

  async function register() {
    try {
      setLoading(true);

      let profilePictureUrl = "";

      // If scout, ensure profile picture is uploaded
      if (category === "scout") {
        if (!data.profile_picture) {
          toast.error("Profile picture must be provided");
          setLoading(false);
          return;
        }
        const uploaded = await uploadImages([data.profile_picture]);
        profilePictureUrl = uploaded.data[0]; // assuming uploadImages returns an array of URLs
      }

      // Build payload for API
      const payload = {
        ...data,
        category, // ensure category is sent
        profile_picture: profilePictureUrl,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split("T")[0] // format YYYY-MM-DD
          : "",
      };

      const response = await Register(payload); // adjust if your ApiService uses another method
      if (response.status === "error") {
        toast.error(response.message);
        console.log(response);
      } else if (category === "scout") {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.success("Now create your portfolio");
        router.push("/auth/upload-pictures");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2.5">
      {/* Splash + Form */}
      <img
        src="/splash.png"
        alt="Splash"
        className="hidden md:block h-[70vh] md:w-2/3 object-cover"
      />
      <div className="md:p-8 flex flex-col gap-5 items-center justify-center">
        <Tabs
          defaultValue="talent"
          className=" flex flex-col gap-2 justify-center items-center"
        >
          <p className="text-h3 font-semibold text-center">
            Sign in today, star tomorrow.
          </p>
          <TabsList>
            <TabsTrigger value="talent" onClick={() => setCategory("talent")}>
              Talent
            </TabsTrigger>
            <TabsTrigger value="scout" onClick={() => setCategory("scout")}>
              Scout
            </TabsTrigger>
          </TabsList>
          <p className="text-title2 font-medium text-center">
            ✨ Join BC Casting to connectss with recruiters, discover
            opportunities, and showcase your talent—all in one place.
          </p>
          <TabsContent value="talent" className="w-full">
            <Content data={data} setData={setData} category="talent" />
          </TabsContent>
          <TabsContent value="scout" className="w-full">
            <Content data={data} setData={setData} category="scout" />
          </TabsContent>
        </Tabs>
        <Button
          className="w-full text-body font-bold text-background"
          onClick={() => register()}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Please wait
            </>
          ) : (
            "Continue"
          )}
        </Button>
        <div className="flex gap-5 items-center">
          <p className="text-title2 font-semibold">General Policy</p>
          <hr className="h-[20px] bg-muted-foreground w-0.5" />
          <p className="text-title2 font-semibold">Terms and Conditions</p>
        </div>
        <p className="text-title2 font-medium text-muted-foreground">
          By signing in you’re agreeing to our Terms and conditions and policies
        </p>
      </div>
    </div>
  );
}

function Content({
  data,
  setData,
  category,
}: {
  data: RegisterUser;
  setData: React.Dispatch<React.SetStateAction<RegisterUser>>;
  category: "talent" | "scout";
}) {
  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);

  React.useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

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

  return (
    <div className="flex gap-2 flex-col md:flex-row">
      {category === "scout" && (
        <ImageUploadUi
          file={data.profile_picture}
          setFile={(file) =>
            setData((p) => ({
              ...p,
              profile_picture:
                typeof file === "function" ? file(p.profile_picture) : file,
            }))
          }
        />
      )}

      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-2">
          <Input
            placeholder="Email"
            className="w-full"
            onChange={(e) =>
              setData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            placeholder="Password"
            type="password"
            className="w-full"
            onChange={(e) =>
              setData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Full Name"
            className="w-full"
            onChange={(e) =>
              setData((prev) => ({ ...prev, fullname: e.target.value }))
            }
          />
          <Input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone Number"
            className="w-full"
            onChange={(e) =>
              setData((prev) => ({ ...prev, phone_number: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2">
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
          <LocationSelect
            value={data.location}
            onChange={(value) => setData((p) => ({ ...p, location: value }))}
          />
        </div>
        <div className="flex gap-2 w-full">
          {category === "talent" && (
            <Select
              onValueChange={(value) => setData((p) => ({ ...p, role: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="what do you do" />
              </SelectTrigger>
              <SelectContent>
                {/* map with roles */}
                <SelectGroup>
                  {roles.map((role, index) => (
                    <SelectItem key={index} value={role.toLowerCase()}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <DatePicker
            date={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
            setDate={(e) =>
              setData((p) => ({ ...p, date_of_birth: e?.toString() ?? "" }))
            }
          />
        </div>
        <Textarea
          className="h-full"
          placeholder="Give us a brief description"
          onChange={(e) => setData((p) => ({ ...p, bio: e.target.value }))}
        />
      </div>
    </div>
  );
}

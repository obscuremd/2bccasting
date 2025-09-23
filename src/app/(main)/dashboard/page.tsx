"use client";
import CustomCard from "@/components/local/card";
import ImageUploadUi from "@/components/local/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCurrentUser } from "@/lib/ApiService";
import { faker } from "@faker-js/faker";
import { Download, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useState } from "react";
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
        if (response === null) {
          toast.error("Unauthorized");
          router.push("/");
          return;
        }
        setData(response);
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <EditProfile loading={editLoading} />
      </Dialog>

      <div className="w-full flex items-center gap-8">
        <CustomCard image={data?.profile_picture} profile={true} />

        <div className="w-[40%] flex flex-col gap-8">
          {/* profile infor */}

          <div>
            {/* profile & buttons */}
            <div className="flex w-full gap-4 items-center">
              <p className="text-h3 font-semibold">{data?.fullname}</p>
              <div className="flex gap-2">
                <Button variant={"secondary"} onClick={() => setIsOpen(true)}>
                  Edit Profile
                </Button>
                <Button onClick={() => router.push("/vip")}>
                  🌟 Become a Vip
                </Button>
              </div>
            </div>
            <p>{data?.category}</p>
            <p>{data?.bio}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-8">
              <div className=" flex gap-2 items-center">
                <p className="text-title1 font-bold">
                  {data?.portfolio_pictures.length}
                </p>
                <p className="text-title2 font-medium">Portfolio Pictures</p>
              </div>
              <div className=" flex gap-2 items-center">
                <p className="text-title1 font-bold">14</p>
                <p className="text-title2 font-medium">Page Insights</p>
              </div>
              <div className=" flex gap-2 items-center">
                <p className="text-title1 font-bold">14</p>
                <p className="text-title2 font-medium">Saves</p>
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
        <hr className="w-[244px] bg-foreground" />
        <p className="text-h3 font-semibold">Portfolio </p>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7 gap-12 [grid-template-rows:masonry]">
        {images && images.length > 0 ? (
          images.map((pic, i) => <CustomCard key={i} image={pic} profile />)
        ) : (
          <p>No Portfolio Pictures</p>
        )}
      </div>
    </div>
  );
}

function EditProfile({ loading }: { loading: boolean }) {
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  return (
    <DialogContent className="flex flex-col gap-10">
      <DialogHeader>
        <DialogTitle>Otp Verification</DialogTitle>
        <DialogDescription>
          a six digit Otp has been sent to your email, please input it below
        </DialogDescription>
        <ImageUploadUi file={imageUrl} setFile={setImageUrl} />
      </DialogHeader>
      <Button className="w-full" disabled={loading}>
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

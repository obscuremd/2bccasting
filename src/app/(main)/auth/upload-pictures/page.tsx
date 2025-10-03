"use client";
import ImageUploadUi from "@/components/local/ImageUpload";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/ApiService";
import { uploadImages } from "@/lib/UtilServices";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);
  const [image5, setImage5] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const uploadPictures = async () => {
    setLoading(true);
    try {
      const auth = await getCurrentUser();

      if (auth.status !== "success" || !auth.user) {
        toast.error(
          auth.status === "pending"
            ? "Please complete registration first"
            : "Error getting user"
        );
        return;
      }

      // filter out nulls so you only send actual files
      const files = [image1, image2, image3, image4, image5].filter(
        (f): f is File => f !== null
      );

      if (files.length < 2) {
        toast.error("Please upload at least 2 photos");
        return;
      }

      const response = await uploadImages(files);

      if (response.message === "success") {
        const res = await axios.put("/api/user", {
          id: auth.user._id,
          profile_picture: response.data[0],
          portfolio_pictures_add: response.data,
        });

        if (res.status === 200) {
          toast.success("Portfolio created successfully");
          router.push("/dashboard");
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
    <div className="flex flex-col gap-2 justify-center items-center">
      <p className="text-h3 font-semibold">Create Your Portfolio</p>
      <p>Add at least 2 studio photos to create your portfolio</p>
      <Button className="w-full" disabled={loading} onClick={uploadPictures}>
        {loading ? (
          <>
            <Loader2Icon className="animate-spin" />
            Please wait
          </>
        ) : (
          "Continue"
        )}
      </Button>

      <div className="grid grid-cols-5 gap-y-4 gap-x-10">
        <ImageUploadUi file={image1} setFile={setImage1} />
        <ImageUploadUi file={image2} setFile={setImage2} />
        <ImageUploadUi file={image3} setFile={setImage3} />
        <ImageUploadUi file={image4} setFile={setImage4} />
        <ImageUploadUi file={image5} setFile={setImage5} />
      </div>
    </div>
  );
}

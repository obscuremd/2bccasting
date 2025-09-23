"use client";
import ImageUploadUi from "@/components/local/ImageUpload";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/ApiService";
import { uploadImages } from "@/lib/UtilServices";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);
  const [image5, setImage5] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const uploadPictures = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (user === null) {
        toast.error("error getting user");
        return;
      }
      // filter out nulls so you only send actual files
      const files = [image1, image2, image3, image4, image5].filter(
        (f): f is File => f !== null
      );

      const response = await uploadImages(files);

      if (response.message === "success") {
        console.log("Uploaded successfully:", response.data);
        const res = await axios.put("/api/user", {
          id: user._id,
          portfolio_pictures_add: response.data,
        });
        if (res.status === 200) {
          toast.success("Portfolio created successfully");
        } else {
          toast.error("error creating portfolio");
        }
      } else {
        console.error("Upload failed");
        toast.error("error uploading pictures");
      }
    } catch (error) {
      toast.error("unknown error");
      console.log(error);
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

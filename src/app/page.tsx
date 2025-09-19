"use client";
import Header from "@/components/local/header";
import CircularGallery from "@/components/local/circular-gallery";
import { Button } from "@/components/ui/button";
import { Button as MButton } from "@/components/ui/moving-border";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { GetProfiles } from "@/lib/ApiService";
import toast from "react-hot-toast";

export default function Home() {
  const [data, setData] = useState<HomeUsers[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const response = await GetProfiles();
        if (response.status === "success") {
          setData(response.data);
          console.log(response.data);
        } else {
          toast.error(response.message);
        }
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  if (loading) {
    return <div>...Loading</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[200px]">
      <Header />
      <div className="flex flex-col items-center gap-2.5 justify-center">
        <MButton
          borderRadius="1.75rem"
          className="bg-background text-black dark:text-white border-neutral-200 dark:border-slate-800 "
        >
          ✨ Become a Star
        </MButton>
        <p className="md:text-h3 text-h5 font-semibold text-center">
          Where Talent Meets Opportunity.
        </p>
        <p className="md:text-h5 text-title2 font-medium md:w-[70%] text-center text-secondary-foreground">
          ✨ From actors to directors, dancers to models—BC Casting is where
          talent and opportunity come together to create magic. 🎬
        </p>
        <div className="flex gap-3">
          <Button variant={"secondary"}>✨Become a Talent</Button>
          <Button>Find New Talent</Button>
        </div>
      </div>
      <div className="w-full h-[600px] relative">
        <CircularGallery
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
          items={(Array.isArray(data) ? data : []).map((user) => ({
            image: user.picture || "",
            text: user.fullname,
          }))}
        />
      </div>
      <div className="flex flex-col gap-2.5 justify-center">
        <div className="flex gap-2.5 items-center">
          <hr className="w-[244px] bg-foreground" />
          <p className="text-h3 font-semibold">About Us </p>
        </div>
        <p className="w-[75%] text-h5 font-medium">
          At BC Casting, we believe every dream deserves a spotlight. We’re a
          dynamic recruiting agency connecting talented individuals with the
          right opportunities in film, fashion, media, and entertainment. From
          actors, models, and dancers to directors, producers, and
          scriptwriters, we bring together the people who make creativity come
          alive. Whether you’re a recruiter searching for the perfect fit or a
          talent ready to shine, BC Casting is the bridge that makes it happen.
        </p>
        <div className="flex gap-3">
          <Button size={"lg"} variant={"secondary"}>
            ✨Become a Talent
          </Button>
          <Button size={"lg"}>Find New Talent</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 justify-center">
        <div className="flex gap-2.5 items-center">
          <hr className="w-[244px] bg-foreground" />
          <p className="text-h3 font-semibold">Acting Slots</p>
        </div>
        <p className="w-[75%] text-h5 font-medium">
          We are one of Nigeria’s leading casting agencies, with experience
          providing production with the artists they need. From extras to
          leading characters. If you are looking for exposure and recognition,
          you have come to the right place.
        </p>
        <Button size={"lg"} className="w-fit">
          Check out our Ratest
        </Button>
      </div>
      <div className="flex flex-col gap-2.5 items-center justify-center border-[1px] border-accent h-[500px]">
        <p className="text-h3 font-semibold">Contact Us</p>
        <p className="w-[75%] text-h5 font-medium text-center">
          Got questions or ready to connect? We’d love to hear from you! Reach
          out to BC Casting at booking@bccasting.com and let’s bring talent and
          opportunity together.
        </p>
        <div className="flex gap-1">
          <Input />
          <Button className="w-fit">Send Mail</Button>
        </div>
      </div>
    </div>
  );
}

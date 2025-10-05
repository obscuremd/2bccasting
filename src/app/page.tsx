"use client";
import Header from "@/components/local/header";
import { Button } from "@/components/ui/button";
import { Button as MButton } from "@/components/ui/moving-border";
import { useEffect, useState } from "react";
import { getCurrentUser, GetProfiles } from "@/lib/ApiService";
import toast from "react-hot-toast";
import RollingGallery from "@/components/RollingGallery";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } finally {
        setLoading(false);
      }
    }

    async function getFeed() {
      setLoading(true);
      try {
        const response = await GetProfiles();
        if (response.status === "success") {
          // extract only pictures into images
          const pics = response.data
            .map((user: HomeUsers) => user.picture)
            .filter((pic: string | undefined) => !!pic) // remove null/undefined
            .slice(0, 10); // only keep first 10

          setData(pics);
          console.log("Pictures:", pics);
        } else {
          toast.error(response.message);
        }
      } finally {
        setLoading(false);
      }
    }
    getUser();

    getFeed();
  }, []);

  if (loading) {
    return <div>...Loading</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center md:gap-[200px] gap-[100px]">
      <Header />
      <div className="flex flex-col w-full items-center gap-2.5 justify-center">
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
          {user === null ? (
            <Button variant={"secondary"} onClick={() => router.push("/auth")}>
              ✨Become a Talent
            </Button>
          ) : (
            <Button
              variant={"secondary"}
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          )}
          <Button onClick={() => router.push("/find-talent")}>
            Find New Talent
          </Button>
        </div>
        <RollingGallery autoplay images={data} />
      </div>
      <div id="about" className="flex flex-col gap-2.5 justify-center">
        <div className="flex gap-2.5 items-center">
          <hr className="md:w-[244px] w-[50px] bg-foreground" />
          <p className="md:text-h3 text-h5 font-semibold">About Us </p>
        </div>
        <p className="md:w-[75%] md:text-h5 text-title2 font-medium">
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
          <hr className="md:w-[244px] w-[50px] bg-foreground" />
          <p className="md:text-h3 text-h5 font-semibold">Acting Slots</p>
        </div>
        <p className="md:w-[75%] md:text-h5 text-title2 font-medium">
          We are one of Nigeria’s leading casting agencies, with experience
          providing production with the artists they need. From extras to
          leading characters. If you are looking for exposure and recognition,
          you have come to the right place.
        </p>

        <Button size={"lg"} className="w-fit">
          Check out our Ratest
        </Button>
      </div>
      <div className="flex flex-col gap-6 items-center justify-center border border-accent md:min-h-[500px] md:py-20 py-5 px-4 text-center">
        <p className="md:text-h3 text-h5 font-semibold">Contact Us</p>
        <p className="max-w-2xl  md:text-h5 text-title2 font-medium">
          Got questions or ready to connect? We’d love to hear from you! Reach
          out to BC Casting at{" "}
          <span className="font-semibold">booking@bccasting.com</span> and let’s
          bring talent and opportunity together.
        </p>
        <a href="mailto:booking@bccasting.com" className="w-full">
          <Button className="w-full">Send Mail</Button>
        </a>
      </div>
    </div>
  );
}

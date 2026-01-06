/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Header from "@/components/local/header";
import { Button } from "@/components/ui/button";
import { Button as MButton } from "@/components/ui/moving-border";
import { useEffect, useState } from "react";
import { getCurrentUser, GetProfiles } from "@/lib/ApiService";
import toast from "react-hot-toast";
import RollingGallery from "@/components/RollingGallery";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Facebook, Instagram, Tiktok, Whatsapp, Youtube } from "iconoir-react";

export default function Home() {
  const router = useRouter();

  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const media = [
    "https://firebasestorage.googleapis.com/v0/b/social-media-fd6de.appspot.com/o/bccasting%2FIMG_7104.PNG?alt=media&token=4e3fbe71-583f-4580-b90f-6da5d409bd4e",

    "https://firebasestorage.googleapis.com/v0/b/social-media-fd6de.appspot.com/o/bccasting%2FIMG_7103.PNG?alt=media&token=7491de8c-197f-4056-baeb-e5de00f8b4a3",

    "https://firebasestorage.googleapis.com/v0/b/social-media-fd6de.appspot.com/o/bccasting%2FIMG_7102.PNG?alt=media&token=4c8ef08b-6030-4e71-8ccd-46b90e6992ef",
    "https://firebasestorage.googleapis.com/v0/b/social-media-fd6de.appspot.com/o/bccasting%2FIMG_7100.PNG?alt=media&token=7af2388e-4b81-4cad-aa28-3ddf21e86f91",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [media.length]);

  useEffect(() => {
    async function init() {
      setLoading(true);

      try {
        // Fetch user
        const userResponse = await getCurrentUser();
        setUser(userResponse.user);

        // Fetch profiles
        const feedResponse = await GetProfiles({
          limit: 10,
          page: 1,
          role: "talent",
        });

        if (feedResponse.status === "success") {
          const pics = feedResponse.data.map((user: HomeUsers) => user.picture);
          setData(pics);
        } else {
          toast.error(feedResponse.message);
        }
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong loading your feed");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-10 p-20">
        <img src={"/Logo.svg"} className="w-52" />
        <MButton
          borderRadius="1.75rem"
          className="bg-background text-[#ffe299] border-neutral-200 dark:border-[#ffe2994e] "
        >
          Loading . . .
        </MButton>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center md:gap-[100px] gap-[50px]">
      <Header />
      <div className="flex flex-col w-full items-center gap-2.5 justify-center">
        <MButton
          borderRadius="1.75rem"
          className="bg-background text-[#ffe299] border-neutral-200 dark:border-[#ffe2994e] "
        >
          ✨ Become a Star
        </MButton>
        <img src={"/Logo.svg"} className="w-52" />
        <p className="md:text-h3 text-h5 font-semibold text-center">
          Where Talent Meets Opportunity.
        </p>
        <p className="md:text-h5 text-title2 font-medium md:w-[70%] text-center text-secondary-foreground">
          ✨ From Actors to Directors, Models to Hostesses BC Castings database
          contain Talents for your projects.Register and Collaborate with us.
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
          BC Castings based in Lagos Nigeria.We believe every dream deserves a
          spotlight, we offer complete services, we are a dynamic recruiting
          agency connecting talented individuals with the right opportunity in
          Casting for Films extra,Commercials, Fashion, Media and Entertainment,
          from Actors to Models, Dancers, Directors, Producers, Scriptwriters
          and more. We bring together the people who makes creativity come
          alive. Whether you are a Recruiter searching for the perfect fit for
          your project or a talent ready to shine, BC Castings is the bridge
          that makes it happen.
        </p>
        <div className="flex flex-wrap gap-3">
          {user === null ? (
            <Button variant={"secondary"} onClick={() => router.push("/auth")}>
              Registration for Talent
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
        <div className="flex flex-wrap gap-3">
          {user === null ? (
            <Button variant={"secondary"} onClick={() => router.push("/auth")}>
              Registration for Recruiter
            </Button>
          ) : (
            <Button
              variant={"secondary"}
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          )}
          <Button onClick={() => router.push("/find-recruiters")}>
            Find Recruiters
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 justify-center">
        <div className="flex gap-2.5 items-center">
          <hr className="md:w-[244px] w-[50px] bg-foreground" />
          <p className="md:text-h3 text-h5 font-semibold">Acting Slots</p>
        </div>
        <p className="md:w-[75%] md:text-h5 text-title2 font-medium">
          We are Nigeria&#39;s Leading Casting Agency based in Lagos and Accra
          with experience in Movie Production, Home Videos, Skits and Musical
          Video shoot. If you are looking for exposure and recognition in
          Nollywood , start by featuring in upcoming movies. Get a Movie role or
          Skit role and secure your spot by getting our Movie Roles Membership
          subscription or Movie Roles Slots and start featuring
          in Upcoming Movies
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <Button
            size={"lg"}
            className="w-fit"
            onClick={() => router.push("/acting-slots")}
          >
            Get movie row slot
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            className="w-fit"
            onClick={() => router.push("/acting-slots/membership-slots")}
          >
            Get membership slots
          </Button>
        </div>
        <div className="relative w-full overflow-hidden h-[40vh] md:h-[90vh]">
          <AnimatePresence mode="wait">
            {media[index] && (
              <motion.img
                key={media[index]}
                src={media[index]}
                alt={`hero image ${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full rounded-4xl object-cover object-top"
                style={{ display: "block" }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-2">
          <p className="text-lg">Follow Us On</p>
          <div className="flex gap-4 flex-wrap">
            {/* Facebook */}
            <SocialIcon
              href="https://www.facebook.com/share/1DodC2yEyS/"
              label="TikTok"
              bg="bg-[#3b63b4]/20"
              hover="hover:bg-[#EE1D52]/10"
            >
              <Facebook className="h-5 w-5 text-[#EE1D52] dark:text-[#3b63b4]" />
              <p>Facebook</p>
            </SocialIcon>
            {/* TikTok */}
            <SocialIcon
              href="tiktok.com/@bccastings"
              label="TikTok"
              bg="bg-[#69C9D0]/10"
              hover="hover:bg-[#EE1D52]/10"
            >
              <Tiktok className="h-5 w-5 text-[#EE1D52] dark:text-[#69C9D0]" />
              <p>TikTok</p>
            </SocialIcon>

            {/* YouTube */}
            <SocialIcon
              href="https://youtube.com/@agencybira86?si=xKktbOoa7UtHer9k"
              label="YouTube"
              bg="bg-[#FF0000]/10"
              hover="hover:bg-[#FF0000]/20"
            >
              <Youtube className="h-5 w-5 text-[#FF0000]" />
              <p>Youtube</p>
            </SocialIcon>

            {/* Instagram */}
            <SocialIcon
              href="https://www.instagram.com/agencybira?igsh=Ym5laDlqa3l6MjZh"
              label="Instagram"
              bg="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
              hover="hover:opacity-90"
            >
              <Instagram className="h-5 w-5 text-white" />
              <p>Instagram</p>
            </SocialIcon>
          </div>
        </div>
      </div>
      <ContactUsForm />
    </div>
  );
}

function ContactUsForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    projectType: "",
    talentType: "",
    beginDate: "",
    deadline: "",
    budget: "",
    info: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // basic validation
    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.location ||
      !form.projectType ||
      !form.talentType ||
      !form.beginDate ||
      !form.deadline ||
      !form.budget ||
      !form.info
    ) {
      toast.error("⚠️ Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const body = `
        📩 New Project Inquiry Received:

        👤 Name / Company: ${form.name}
        📞 Phone: ${form.phone}
        📧 Email: ${form.email}
        📍 Location: ${form.location}
        🎬 Project Type: ${form.projectType}
        🧑‍🎤 Talent Needed: ${form.talentType}
        🗓️ Begin Date: ${form.beginDate}
        ⏰ Deadline: ${form.deadline}
        💰 Budget: ${form.budget}

        📝 More Info:
        ${form.info}
      `;

      const res = await axios.post("/api/email", {
        to: "nigeriacasting@gmail.com ",
        subject: "🎥 New Casting Project Inquiry",
        body,
      });

      if (res.status === 200) {
        toast.success(
          "Thanks for the message We will contact you within 24hrs"
        );
        setForm({
          name: "",
          phone: "",
          email: "",
          location: "",
          projectType: "",
          talentType: "",
          beginDate: "",
          deadline: "",
          budget: "",
          info: "",
        });
      }
    } catch (err) {
      toast.error("❌ Failed to send your inquiry. Please try again later.");
      console.error("Contact form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 items-center justify-center border border-accent md:min-h-[500px] md:py-20 py-10 px-6 text-center rounded-xl">
      <div className="flex flex-col gap-2">
        <p className="md:text-h3 text-h5 font-semibold">Contact Us</p>
        <p className="max-w-2xl mx-auto md:text-title1 text-title2 font-medium text-secondary-foreground">
          Are you looking for suitable cast for your project in Commercials or
          Films? We collaborate with Local and International Clients. Fill the
          form below or email{" "}
          <span className="font-semibold">nigeriacasting@gmail.com </span>.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left"
      >
        <div>
          <p className="font-medium mb-1">Name / Company</p>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your name or company"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Phone No.</p>
          <Input
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Email</p>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Location</p>
          <Input
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="City, Country"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Type of Project</p>
          <Input
            value={form.projectType}
            onChange={(e) => handleChange("projectType", e.target.value)}
            placeholder="e.g. Commercial, Short Film, Documentary"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Type of Talent Needed</p>
          <Input
            value={form.talentType}
            onChange={(e) => handleChange("talentType", e.target.value)}
            placeholder="e.g. Models, Actors, Voice Artists"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Begin Date</p>
          <Input
            type="date"
            value={form.beginDate}
            onChange={(e) => handleChange("beginDate", e.target.value)}
          />
        </div>

        <div>
          <p className="font-medium mb-1">Deadline</p>
          <Input
            type="date"
            value={form.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <p className="font-medium mb-1">Budget</p>
          <Input
            value={form.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
            placeholder="Enter budget (e.g. $5000 or ₦5,000,000)"
          />
        </div>

        <div className="md:col-span-2">
          <p className="font-medium mb-1">
            Give more information about your project
          </p>
          <Textarea
            value={form.info}
            onChange={(e) => handleChange("info", e.target.value)}
            placeholder="Describe your project in detail..."
            rows={5}
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Submit Inquiry"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function SocialIcon({ href, label, bg, hover, children }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={` w-fit px-4 py-2 rounded-full flex gap-2 items-center justify-center ${bg} ${hover} transition-all duration-200 hover:scale-105`}
    >
      {children}
    </a>
  );
}

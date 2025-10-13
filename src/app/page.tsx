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
          BC Casting Agency based in Lagos Nigeria, we believe every dream
          deserves a spotlight. We’re a dynamic recruiting agency connecting
          talented individuals with the right opportunities in film, fashion,
          media, and entertainment. From actors, models, and dancers to
          directors, producers, and scriptwriters, we bring together the people
          who make creativity come alive. Whether you’re a recruiter searching
          for the perfect fit or a talent ready to shine, BC Castings is the
          bridge that makes it happen.
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
      </div>
      <div className="flex flex-col gap-2.5 justify-center">
        <div className="flex gap-2.5 items-center">
          <hr className="md:w-[244px] w-[50px] bg-foreground" />
          <p className="md:text-h3 text-h5 font-semibold">Acting Slots</p>
        </div>
        <p className="md:w-[75%] md:text-h5 text-title2 font-medium">
          We are Nigerian&apos;s Leading Casting agencies based in Lagos and
          Accra with experience in Movies Production, Home Video, Skit and
          Musical Video shoot.If you are looking for exposure and recognition in
          Nollywood, start by featuring in upcoming Movies. Get a Movie Role or
          Skit Role and Secure your spot by getting our Movie Roles Membership
          Subscription or Movie Roles Slots and start featuring in Upcoming
          Movies.
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
        to: "support@bccastings.com",
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
          <span className="font-semibold">support@bccastings.com</span>.
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
            placeholder="Enter budget (e.g. $1000 or ₦500,000)"
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

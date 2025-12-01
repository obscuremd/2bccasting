"use client";
import { useEffect, useState } from "react";
import CustomCard from "@/components/local/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/local/copy";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/ApiService";
import toast from "react-hot-toast";
import axios from "axios";

interface Flyer {
  _id: string;
  userId: string;
  flyer_image?: string;
  company_name: string;
  profession: string;
  skills: string;
  education: string;
  gender: "male" | "female";
  location: string;
  project_begin: Date;
  project_end: Date;
  amount?: string;
  description?: string[];
}

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone_number: string;
  vip?: boolean;
}

export default function FlyerInfoPage() {
  const { id } = useParams<{ id: string }>();
  const [flyer, setFlyer] = useState<Flyer | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFlyer() {
      try {
        const res = await axios.get(`/api/flyer?type=single&id=${id}`);
        const flyerData = res.data.flyer;
        setFlyer(flyerData);

        // Fetch creator info
        if (flyerData?.userId) {
          const userRes = await axios.get(`/api/user?id=${flyerData.userId}`);
          setCreator(userRes.data);
        }
      } catch (error) {
        console.error("Error fetching flyer:", error);
        toast.error("Failed to load flyer details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchFlyer();
  }, [id]);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res.status === "success") {
        setLoggedInUser(res.user);
      }
    });
  }, []);

  if (loading) return <p className="text-center p-10">Loading flyer...</p>;
  if (!flyer) return <p className="text-center p-10">Flyer not found</p>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[10px]">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {creator?.vip ? (
          <VipDialog user={creator} />
        ) : (
          <NDialog user={creator} loggedUser={loggedInUser} />
        )}
      </Dialog>

      {/* Flyer Header Section */}
      <div className="w-full flex flex-col md:flex-row items-center gap-8">
        <CustomCard
          image={flyer.flyer_image || "/placeholder.jpg"}
          profile={true}
        />

        <div className="md:w-[40%] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row w-full gap-4 items-start md:items-center">
              <p className="text-h3 font-semibold">{flyer.company_name}</p>
              <Button onClick={() => setModalOpen(true)}>
                <Phone /> Contact
              </Button>
            </div>
            <p className="capitalize text-title1 font-semibold">
              {flyer.profession}
            </p>
            <p className="text-sm text-muted-foreground">
              {flyer.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <p>
              <b>Skills:</b> {flyer.skills || "N/A"}
            </p>
            <p>
              <b>Education:</b> {flyer.education || "N/A"}
            </p>
            <p>
              <b>Gender:</b> {flyer.gender}
            </p>
            <p>
              <b>Location:</b> {flyer.location}
            </p>
            <p>
              <b>Amount:</b> {flyer.amount || "N/A"}
            </p>
            <p>
              <b>Duration:</b> {formatDate(flyer.project_begin)} -{" "}
              {formatDate(flyer.project_end)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- VIP DIALOG ---------------- */
function VipDialog({ user }: { user: User }) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Contact Info</DialogTitle>
        <DialogDescription>
          Copy the details below to contact {user.fullname}.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 mt-4">
        <CopyButton value={user.email} />
        <CopyButton value={user.phone_number} />
      </div>
    </DialogContent>
  );
}

/* ---------------- NON-VIP DIALOG ---------------- */
function NDialog({
  user,
  loggedUser,
}: {
  user: User | null;
  loggedUser: User | null;
}) {
  const [email, setEmail] = useState(loggedUser?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    loggedUser?.phone_number || ""
  );
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!user) return;
    if (!loggedUser && (!email || !phoneNumber)) {
      toast.error("Please enter your email and phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/email", {
        to: "support@bccastings.com",
        subject: "Contact Information Request",
        body: `
          <p>A user has requested the contact information for the flyer <b>${
            user.fullname
          }</b>.</p>
          <p><b>Requester Name:</b> ${loggedUser?.fullname || "Guest"}</p>
          <p><b>Requester Email:</b> ${loggedUser?.email || email}</p>
          <p><b>Requester Phone Number:</b> ${
            loggedUser?.phone_number || phoneNumber
          }</p>
         <p><b>Requested Profile:</b> ${user.fullname}</p>
          <p><b>Requested Email:</b> ${user.email}</p>
          <p><b>Requested Phone Number:</b> ${user.phone_number}</p>
        `,
      });

      if (res.status === 200) {
        toast.success("✅ Request received! You’ll be contacted within 24hrs.");
      } else {
        toast.error("❌ Failed to send request. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Contact Info</DialogTitle>
        <DialogDescription>
          {loggedUser ? (
            <>
              Hi <b>{loggedUser.fullname}</b> 👋, we’ll send your request to{" "}
              <b>{user?.fullname}</b>. You’ll receive a response at{" "}
              <b>{loggedUser.email}</b>.
            </>
          ) : (
            <>
              Please input your contact details and <b>{user?.fullname}</b> will
              contact you within 24 hours.
            </>
          )}
        </DialogDescription>
      </DialogHeader>

      {!loggedUser && (
        <>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3"
            type="email"
          />
          <Input
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-3"
            type="tel"
          />
        </>
      )}

      <Button
        onClick={handleRequest}
        disabled={loading}
        className="mt-4 w-full"
      >
        {loading
          ? "Sending..."
          : loggedUser
          ? "Send Request"
          : "Request Contact Info"}
      </Button>
    </DialogContent>
  );
}

/* ---------------- DATE FORMATTER ---------------- */
function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

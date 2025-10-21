"use client";
import { useEffect, useState } from "react";
import CustomCard from "@/components/local/card";
import { Button } from "@/components/ui/button";
import { Download, Heart, Phone } from "lucide-react";
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

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetch(`/api/user?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res.status === "success") {
        setLoggedInUser(res.user);
      }
    });
  }, []);

  if (loading) {
    return <p className="text-center p-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center p-10">User not found</p>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[10px]">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {user?.vip ? (
          <VipDialog user={user} />
        ) : (
          <NDialog user={user} loggedUser={loggedInUser} />
        )}
      </Dialog>

      {/* Hero Section */}
      <div className="w-full flex flex-col md:flex-row items-center gap-8">
        <CustomCard
          image={user.profile_picture || "/placeholder.jpg"}
          profile={true}
        />

        <div className="md:w-[40%] flex flex-col gap-8">
          {/* Profile Info */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row w-full gap-4 items-start md:items-center">
              <p className="text-h3 font-semibold">{user.fullname}</p>
              <Button onClick={() => setModalOpen(true)}>
                <Phone /> Contact
              </Button>
            </div>
            <p className="capitalize text-title1 font-semibold">{user.role}</p>
            <p>{user.bio || "No bio provided."}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <p>
              Age:{" "}
              {user.date_of_birth
                ? new Date().getFullYear() -
                  new Date(user.date_of_birth).getFullYear()
                : "N/A"}{" "}
              Years Old
            </p>
            <p>Gender: {user.gender || "N/A"}</p>
            <p>
              State:{" "}
              {user?.location?.includes(",")
                ? user.location.split(", ")[0]
                : "—"}
            </p>
            <p>
              Country:{" "}
              {user?.location?.includes(",")
                ? user.location.split(", ")[1]
                : user?.location}
            </p>
          </div>

          {/* <Button>
            <Download /> Download CV
          </Button> */}
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="flex gap-2.5 items-center w-full">
        <hr className="w-[100px] md:w-[244px] bg-foreground" />
        <p className="text-h3 font-semibold">Portfolio </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-5 gap-6">
        {user?.portfolio_pictures?.length > 0 ? (
          user.portfolio_pictures.map((pic: string, i: number) => (
            <CustomCard
              key={i}
              primary_text={user.fullname}
              secondary_text={user.role}
              category={user.category}
              image={pic}
              profile
            />
          ))
        ) : (
          <p className="col-span-full text-center">No portfolio pictures</p>
        )}
      </div>
    </div>
  );
}

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
function NDialog({
  user,
  loggedUser,
}: {
  user: User;
  loggedUser: User | null;
}) {
  const [email, setEmail] = useState(loggedUser?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    loggedUser?.phone_number || ""
  );
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
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
          <p>A user has requested the contact information of the model <b>${
            user.fullname
          }</b>.</p>
          <p><b>Requester Name:</b> ${loggedUser?.fullname || "Guest"}</p>
          <p><b>Requester Email:</b> ${loggedUser?.email || email}</p>
          <p><b>Requester Phone Number:</b> ${
            loggedUser?.phone_number || phoneNumber
          }</p>
          <p><b>Requested Profile:</b> ${user.fullname}</p>
        `,
      });

      if (res.status === 200) {
        toast.success(
          "✅ Your Request has been Received you will be contacted within 24hrs"
        );
      } else {
        toast.error("❌ Failed to send request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Please try again.");
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
              <b>{user.fullname}</b>. You’ll receive a response at{" "}
              <b>{loggedUser.email}</b>.
            </>
          ) : (
            <>
              Please input your contact details and <b>{user.fullname}</b> will
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

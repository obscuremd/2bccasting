"use client";
import { useEffect, useState } from "react";
import CustomCard from "@/components/local/card";
import { Button } from "@/components/ui/button";
import { Download, Heart, Phone } from "lucide-react";
import { useParams } from "next/navigation";

// Next.js Page Component with dynamic params
export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-center p-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center p-10">User not found</p>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[10px]">
      {/* Hero Section */}
      <div className="w-full flex items-center gap-8">
        <CustomCard
          image={user.profile_picture || "/placeholder.jpg"}
          profile={true}
        />

        <div className="w-[40%] flex flex-col gap-8">
          {/* Profile Info */}
          <div>
            {/* Name & Buttons */}
            <div className="flex w-full justify-between">
              <p className="text-h3 font-semibold">{user.fullname}</p>
              <div className="flex gap-2">
                <Button variant={"secondary"}>
                  <Heart />
                  Save Profile
                </Button>
                <Button>
                  <Phone />
                  Contact
                </Button>
              </div>
            </div>
            <p className="capitalize">{user.role}</p>
            <p>{user.bio || "No bio provided."}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-8 gap-x-2">
            <p>
              Age:{" "}
              {user.date_of_birth
                ? new Date().getFullYear() -
                  new Date(user.date_of_birth).getFullYear()
                : "N/A"}{" "}
              Years Old
            </p>
            <p>Gender: {user.gender || "N/A"}</p>
            <p>Ethnicity: {user.location || "N/A"}</p>
            <p>Country: {user.location?.split(",")[1] || "N/A"}</p>
            <p>State: {user.location?.split(",")[0] || "N/A"}</p>
            <p>Experience: {user.gender || "N/A"}</p>
          </div>

          <Button>
            <Download /> Download CV
          </Button>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="flex gap-2.5 items-center w-full">
        <hr className="w-[244px] bg-foreground" />
        <p className="text-h3 font-semibold">Portfolio </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7 gap-12 [grid-template-rows:masonry]">
        {user?.portfolio_pictures?.length > 0 ? (
          user.portfolio_pictures.map((pic: string, i: number) => (
            <CustomCard
              key={i}
              primary_text={user.fullname}
              secondary_text={user.role}
              category={user.category}
              image={pic}
            />
          ))
        ) : (
          <p className="col-span-full text-center">No portfolio pictures</p>
        )}
      </div>
    </div>
  );
}

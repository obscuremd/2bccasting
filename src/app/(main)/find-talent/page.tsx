"use client";
import CustomCard from "@/components/local/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetProfiles } from "@/lib/ApiService";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [data, setData] = useState<HomeUsers[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const response = await GetProfiles();
        if (response.status === "success") {
          setData(response.data);
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
    <div className="w-full min-h-screen flex flex-col items-center gap-[250px]">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-2.5 justify-center">
        <p className="md:text-h3 text-h5 font-semibold text-center">
          🔍 Find the right talent, faster.
        </p>
        <p className="md:text-h5 text-title2 font-medium md:w-[50%] text-center text-secondary-foreground">
          Easily explore our network of actors, models, directors, and more.
          With powerful search tools, finding the right match for your next
          project has never been simpler.
        </p>
        <div className="flex gap-3 w-[50%] max-md:w-[90%]">
          <Input placeholder="Find a Talent" className="w-full" />
          <Button>Find New Talent</Button>
        </div>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 [grid-template-rows:masonry]">
        {data.map((talent, i) => (
          <Link href={`profile/${talent._id}`} key={i}>
            <CustomCard
              primary_text={talent.fullname}
              secondary_text={`${talent.age} Years old`}
              category={talent.role}
              image={talent.picture}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

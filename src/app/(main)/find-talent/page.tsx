"use client";
import CustomCard from "@/components/local/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetProfiles } from "@/lib/ApiService";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// shadcn imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const roles = [
    "Actor",
    "Model",
    "Hostess",
    "Voice Over Artist",
    "Fashion Designer",
    "Presenter",
    "Influencer",
    "Script Writer",
    "Movie Producer",
    "Movie Director",
    "Graphics Designer",
    "Web Developer",
    "Digital Marketer",
    "Cinematographer",
    "Event Planner",
    "Driver",
  ];
  const [data, setData] = useState<HomeUsers[]>([]);
  const [loading, setLoading] = useState(false);

  // filter states
  const [search, setSearch] = useState("");
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 80]);
  const [sex, setSex] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const response = await GetProfiles();
        if (response.status === "success") {
          setData(response.data);
          console.log("res:", response.data);
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

  // derived filtered data
  const filteredData = data.filter((talent) => {
    const matchesSearch = search
      ? talent.fullname?.toLowerCase().includes(search.toLowerCase())
      : true;

    const age = Number(talent.age);
    const matchesAge = age >= ageRange[0] && age <= ageRange[1];

    const matchesSex = sex
      ? talent.gender?.toLowerCase() === sex.toLowerCase()
      : true;

    const matchesLocation = location
      ? talent.location?.toLowerCase().includes(location.toLowerCase())
      : true;

    const matchesRole = role
      ? talent.role?.toLowerCase() === role.toLowerCase()
      : true;

    return (
      matchesSearch &&
      matchesAge &&
      matchesSex &&
      matchesLocation &&
      matchesRole
    );
  });

  console.log("data:", filteredData);

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[50px] md:gap-[250px]">
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
          <Input
            placeholder="Find a Talent"
            className="w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Filters</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Options</DialogTitle>
                <DialogDescription>
                  Narrow down your search with filters
                </DialogDescription>
              </DialogHeader>

              {/* Role filter */}
              <div className="flex flex-col gap-2">
                <p className="font-medium">Role</p>
                <Select onValueChange={(val) => setRole(val)} value={role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role, index) => (
                      <SelectItem key={index} value={role.toLowerCase()}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Sex filter */}
              <div className="flex flex-col gap-2">
                <p className="font-medium">Sex</p>
                <Select onValueChange={(val) => setSex(val)} value={sex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location filter */}
              <div className="flex flex-col gap-2">
                <p className="font-medium">Location</p>
                <Input
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Age filter */}
              <div className="flex flex-col gap-2">
                <p className="font-medium">Age Range</p>
                <Slider
                  min={0}
                  max={80}
                  step={1}
                  value={ageRange}
                  onValueChange={(v) =>
                    setAgeRange([v[0], v[1]] as [number, number])
                  }
                />
                <p>
                  {ageRange[0]} - {ageRange[1]} years
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Talent Cards */}
      <div className="columns-1 sm:columns-2 lg:columns-5 gap-6">
        {filteredData.map((talent, i) => (
          <Link
            href={`profile/${talent._id}`}
            key={i}
            className="break-inside-avoid"
          >
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

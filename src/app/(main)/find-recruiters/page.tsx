"use client";
import CustomCard from "@/components/local/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetProfiles } from "@/lib/ApiService";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [data, setData] = useState<HomeUsers[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 80]);
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");

  // Fetch profiles
  async function fetchProfiles(currentPage: number) {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await GetProfiles({
        limit: 10,
        page: currentPage,
        role: "scout",
      });

      if (response.status === "success") {
        setData((prev) => [...prev, ...response.data]);
        setHasMore(response.data.length > 0);
        setPage((prev) => prev + 1);
      } else {
        toast.error(response.message);
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profiles.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchProfiles(1);
  }, []);

  // filters
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[50px] md:gap-[250px]">
      {/* Header */}
      <div className="w-full flex flex-col items-center px-4 md:px-10 lg:px-20 gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="md:text-h3 text-h5 font-semibold">
            Find The Right Recruiter, Faster.
          </p>
          <p className="md:text-h5 text-title2 font-medium md:w-[60%] text-secondary-foreground">
            Discover a professional network of Recruiters and Casting Agents for
            Commercials, Films, and Creative Projects — equipped with powerful
            tools to help you connect with the right professionals for your next
            opportunity.
          </p>
        </div>

        {/* Filters */}
        <div className="w-full max-w-5xl bg-muted/40 border border-border rounded-2xl p-5 md:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Search Field */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm text-muted-foreground">
                Search
              </p>
              <Input
                placeholder="Search by name..."
                className="w-full border-border focus:ring-2 focus:ring-primary/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sex filter */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm text-muted-foreground">Sex</p>
              <Select onValueChange={setSex} value={sex}>
                <SelectTrigger className="w-full border-border focus:ring-2 focus:ring-primary/50">
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
              <p className="font-medium text-sm text-muted-foreground">
                Location
              </p>
              <Input
                placeholder="Enter location..."
                className="w-full border-border focus:ring-2 focus:ring-primary/50"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Age Range filter */}
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <p className="font-medium text-sm text-muted-foreground">
                Age Range
              </p>
              <Slider
                min={0}
                max={80}
                step={1}
                value={ageRange}
                onValueChange={(v) =>
                  setAgeRange([v[0], v[1]] as [number, number])
                }
              />
              <p className="text-sm text-muted-foreground">
                {ageRange[0]} - {ageRange[1]} years
              </p>
            </div>
          </div>

          {/* Clear Filters */}
          {(search || role || sex || location) && (
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setRole("");
                  setSex("");
                  setLocation("");
                  setAgeRange([0, 80]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Talent Cards */}
      <div className="columns-2 sm:columns-2 lg:columns-5 gap-6 w-full px-4 md:px-10">
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

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center my-10">
          <Button
            onClick={() => fetchProfiles(page)}
            disabled={loading}
            className="px-6 py-3 text-sm font-medium"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {!hasMore && (
        <p className="text-muted-foreground mb-10">No more profiles</p>
      )}
    </div>
  );
}

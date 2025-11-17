"use client";
import CustomCard from "@/components/local/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [data, setData] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("");
  const [amountRange, setAmountRange] = useState<[number, number]>([
    0, 999999999,
  ]);

  // Fetch flyers
  async function fetchFlyers(currentPage: number) {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get<{ data: Flyer[] }>(`/api/flyer?type=all`);
      const fetched = res.data.data || [];
      setData(fetched);
      setHasMore(false); // assuming API returns all flyers at once for now
    } catch (err) {
      console.error(err);
      toast.error("Failed to load flyers");
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchFlyers(1);
  }, []);

  // Filters
  const filteredData = data.filter((flyer) => {
    const matchesSearch = search
      ? flyer.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        flyer.profession?.toLowerCase().includes(search.toLowerCase()) ||
        flyer.skills?.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesSex = sex
      ? flyer.gender.toLowerCase() === sex.toLowerCase()
      : true;

    const matchesLocation = location
      ? flyer.location?.toLowerCase().includes(location.toLowerCase())
      : true;

    const matchesProfession = profession
      ? flyer.profession?.toLowerCase().includes(profession.toLowerCase())
      : true;

    const amount = flyer.amount ? parseFloat(flyer.amount) : 0;
    const matchesAmount = amount >= amountRange[0] && amount <= amountRange[1];

    return (
      matchesSearch &&
      matchesSex &&
      matchesLocation &&
      matchesProfession &&
      matchesAmount
    );
  });

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[50px] md:gap-[250px]">
      {/* Header */}
      <div className="w-full flex flex-col items-center px-4 md:px-10 lg:px-20 gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="md:text-h3 text-h5 font-semibold">
            Find the Right Opportunity Faster.
          </p>
          <p className="md:text-h5 text-title2 font-medium md:w-[60%] text-secondary-foreground">
            Unique Opportunity to find Temporary Employment, Contractors, Movie
            Directors, Freelancers, Talent Hunters, Part time jobs. Contains
            Free Analysis proposal, price quotation and project timeline.Find
            your Skillset Match.
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
                placeholder="Company Name"
                className="w-full border-border focus:ring-2 focus:ring-primary/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Gender filter */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm text-muted-foreground">
                Gender
              </p>
              <Select onValueChange={setSex} value={sex}>
                <SelectTrigger className="w-full border-border focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
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

            {/* Profession filter */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm text-muted-foreground">
                Profession
              </p>
              <Input
                placeholder="Enter profession..."
                className="w-full border-border focus:ring-2 focus:ring-primary/50"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>

            {/* Amount Range filter */}
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <p className="font-medium text-sm text-muted-foreground">
                Quotation (₦)
              </p>
              <Slider
                min={0}
                max={999999999}
                step={100}
                value={amountRange}
                onValueChange={(v) =>
                  setAmountRange([v[0], v[1]] as [number, number])
                }
              />
              <p className="text-sm text-muted-foreground">
                ₦{amountRange[0]} - ₦{amountRange[1]}
              </p>
            </div>
          </div>

          {/* Clear Filters */}
          {(search || profession || sex || location) && (
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setProfession("");
                  setSex("");
                  setLocation("");
                  setAmountRange([0, 10000]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Flyers */}
      <div className="columns-2 sm:columns-2 lg:columns-5 gap-6 w-full px-4 md:px-10">
        {filteredData.map((flyer, i) => (
          <Link
            href={`/flyer/${flyer._id}`}
            key={i}
            className="break-inside-avoid"
          >
            <CustomCard
              primary_text={flyer.profession}
              secondary_text={flyer.company_name}
              category={` ${flyer.location}\n${flyer.amount} `}
              image={flyer.flyer_image}
              bottom
            />
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center my-10">
          <Button
            onClick={() => fetchFlyers(page + 1)}
            disabled={loading}
            className="px-6 py-3 text-sm font-medium"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {!hasMore && (
        <p className="text-muted-foreground mb-10">No more flyers</p>
      )}
    </div>
  );
}

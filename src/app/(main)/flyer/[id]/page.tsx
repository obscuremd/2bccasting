"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/local/copy";
import toast from "react-hot-toast";

export default function FlyerInfoPage() {
  const { id } = useParams<{ id: string }>();
  const [flyer, setFlyer] = useState<Flyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactModal, setContactModal] = useState(false);

  useEffect(() => {
    async function fetchFlyer() {
      try {
        const res = await axios.get(`/api/flyer?type=single&id=${id}`);
        setFlyer(res.data.flyer);
      } catch (error) {
        console.error("Error fetching flyer:", error);
        toast.error("Failed to load flyer details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchFlyer();
  }, [id]);

  if (loading) return <p className="text-center p-10">Loading flyer...</p>;
  if (!flyer) return <p className="text-center p-10">Flyer not found</p>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-6">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row items-center gap-8">
        <img
          src={flyer.flyer_image || "/placeholder.jpg"}
          alt={flyer.company_name}
          className="rounded-xl object-cover shadow-md w-80"
        />

        <div className="md:w-[50%] flex flex-col gap-4">
          <h1 className="text-h3 font-bold">{flyer.company_name}</h1>
          <p className="capitalize text-lg font-semibold">{flyer.profession}</p>
          <p className="text-sm">
            {flyer.description || "No description provided"}
          </p>

          <div className="grid grid-cols-2 gap-y-3 mt-2">
            <p>
              <b>Skills:</b> {flyer.skills}
            </p>
            <p>
              <b>Education:</b> {flyer.education}
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

          <Button className="mt-4" onClick={() => setContactModal(true)}>
            Contact Creator
          </Button>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={contactModal} onOpenChange={setContactModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <CopyButton value={flyer.company_name} />
            <CopyButton value={flyer.location} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

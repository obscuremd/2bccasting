import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const jobs = [
  "WEB DEVELOPER",
  "NAIL ARTIST / PEDICURIST",
  "DOP / VIDEO EDITOR",
  "SOCIAL MEDIA MANAGER",
  "PHOTOGRAPHER / EDITOR",
  "RECEPTIONIST / FRONT DESK",
  "MODEL / CONTENT CREATOR",
  "GYM INSTRUCTOR / SUPERVISOR",
  "POS GIRL OPERATOR",
  "SALES GIRL / CONTENT CREATOR",
  "HAIR STYLIST / LASH TECHNICIAN",
  "SALON BARBER / HAIR STYLIST",
  "PROFESSIONAL BOLT DRIVER",
  "PROFESSIONAL KEKE DRIVER",
  "CUSTOMER SERVICE / ALL ROUNDER",
  "SECRETARY / PERSONAL ASSISTANT",
];

export default function Page() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {jobs.map((job, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{job}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

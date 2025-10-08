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
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">JOB VACANCY</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl flex flex-col">
          LOCATION: ALIMOSHO LAGOS
          <span>
            NOW HIRING SEND YOUR CV TO WHATSAPP‪+2347047777561‬ For inquiries
            and job placement contact us.
          </span>
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {jobs.map((job, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{job}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";

// shadcn UI imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";

type FormFields = {
  name: string;
  package: string;
  amount: string;
  notes: string;
};

export default function Page() {
  const pricing = [
    { roles: "1 ROLE", ngn: "₦20,000", gh: "200GH₵", usd: "$20" },
    { roles: "3 ROLES", ngn: "₦80,000", gh: "800GH₵", usd: "$80" },
    { roles: "7 ROLES", ngn: "₦250,000", gh: "2500GH₵", usd: "$250" },
    { roles: "9 ROLES", ngn: "₦300,000", gh: "3000GH₵", usd: "$300" },
    { roles: "11 ROLES", ngn: "₦350,000", gh: "3500GH₵", usd: "$350" },
    { roles: "15 ROLES", ngn: "₦500,000", gh: "5000GH₵", usd: "$500" },
    { roles: "18 ROLES", ngn: "₦700,000", gh: "7000GH₵", usd: "$700" },
    { roles: "20 ROLES", ngn: "₦1M", gh: "10,000GH₵", usd: "$1,000" },
    { roles: "UNLIMITED", ngn: "₦10M", gh: "100,000GH₵", usd: "$10,000" },
  ];

  const [form, setForm] = useState<FormFields>({
    name: "",
    package: "",
    amount: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: keyof FormFields, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.package || !form.amount || !form.notes) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          packageSelected: form.package,
          amount: form.amount,
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setMessage("✅ Payment proof submitted successfully!");
      setForm({ name: "", package: "", amount: "", notes: "" });
    } catch (err) {
      setMessage("❌ Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">
          BC CASTINGS — Get Movie Role Slot
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Select the number of role slots suitable for you and pay using the
          account details below. After payment, send proof to get your pass code
          and VIP access.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pricing Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Choose one of the role slot packages below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number of Roles</TableHead>
                  <TableHead>Pay in ₦</TableHead>
                  <TableHead>Pay in GH₵</TableHead>
                  <TableHead>Pay in USD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricing.map((p) => (
                  <TableRow key={p.roles}>
                    <TableCell className="font-medium">{p.roles}</TableCell>
                    <TableCell>{p.ngn}</TableCell>
                    <TableCell>{p.gh}</TableCell>
                    <TableCell>{p.usd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                How to register (summary):
              </p>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                <li>Select a package and pay to the account number below.</li>
                <li>
                  Send evidence of payment (name of depositor, amount, date) to
                  the WhatsApp number or email.
                </li>
                <li>
                  After confirmation you will be added to the VIP WhatsApp group
                  and receive a membership form and pass code.
                </li>
                <li>
                  Use the pass code on-site to claim roles. Lost pass codes cost
                  $10 to replace.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Contact Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Payment Methods & Contact</CardTitle>
            <CardDescription>
              Account details to send payment and how to reach us.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-sm font-semibold">Nigeria (Naira)</h3>
              <p className="text-sm">Bank: UBA Nigeria</p>
              <p className="text-sm">
                Account Name: BIRA RECRUITING AGENCY LIMITED
              </p>
              <p className="text-sm">Account No: 1025207623</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mt-3 text-nowrap">
                USD (Nigeria)
              </h3>
              <p className="text-sm text-nowrap">Bank: Zenith Bank Nigeria</p>
              <p className="text-sm text-nowrap">
                Account Name: BUMSHALALA RECORDS
              </p>
              <p className="text-sm text-nowrap">Account No: 1017511611</p>
              <p className="text-sm text-nowrap">Sort Code: 015151096</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mt-3 text-nowrap">Ghana</h3>
              <p className="text-sm text-nowrap">Bank: Access Bank</p>
              <p className="text-sm text-nowrap">
                Account Name: Bira Bumshalala Int&apos;l LTD
              </p>
              <p className="text-sm text-nowrap">Account No: 1036000004690</p>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground text-nowrap">
                <Mail size={16} />
                <a href="mailto:Support@bccastings.com" className="underline">
                  Support@bccastings.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 text-nowrap">
                <Phone size={16} />
                <a href="tel:+2347047777561" className="underline">
                  +234 704 777 7561
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form Card */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Register / Send Payment Proof</CardTitle>
              <CardDescription>
                If you&apos;ve already paid, submit your proof here and
                we&apos;ll follow up.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                onSubmit={handleSubmit}
              >
                <div className="md:col-span-1 space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-1 space-y-2">
                  <Label>Package</Label>
                  <Select
                    onValueChange={(value) => handleChange("package", value)}
                    value={form.package}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricing.map((p) => (
                        <SelectItem key={p.roles} value={p.roles}>
                          {p.roles} — {p.ngn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-1 space-y-2">
                  <Label>Amount Paid</Label>
                  <Input
                    placeholder="e.g. ₦20,000"
                    value={form.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <Label>Payment Evidence / Notes</Label>
                  <Textarea
                    placeholder="Depositor name, date, transaction ID, WhatsApp number..."
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-3 flex items-center gap-3 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setForm({ name: "", package: "", amount: "", notes: "" })
                    }
                    disabled={loading}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Proof"}
                  </Button>
                </div>
              </form>

              {message && (
                <p className="text-sm mt-3 text-muted-foreground">{message}</p>
              )}

              <p className="text-xs text-muted-foreground mt-3">
                After submission our team will confirm payment and add you to
                the VIP group where you&apos;ll receive a membership form and
                pass code.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-10 text-sm text-muted-foreground">
        <p>
          Loss of passcode: $10 | For more details contact
          Support@bccastings.com or WhatsApp +2347047777561
        </p>
      </footer>
    </div>
  );
}

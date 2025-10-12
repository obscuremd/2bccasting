"use client";
import React, { useState } from "react";
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
import axios from "axios";

type FormFields = {
  name: string;
  membership: string;
  amount: string;
  notes: string;
};

export default function MembershipPage() {
  const memberships = [
    {
      name: "Silver Membership — 7 Movie Roles",
      ngn: "₦380,000",
      gh: "3,800GH₵",
      usd: "$380",
    },
    {
      name: "Gold Membership (Lead Role) — 10 Movie Roles",
      ngn: "₦500,000",
      gh: "5,000GH₵",
      usd: "$500",
    },
    {
      name: "Sapphire Membership (Lead Role with Star) — 10 Roles",
      ngn: "₦700,000",
      gh: "7,000GH₵",
      usd: "$700",
    },
    {
      name: "Platinum Membership (Lead Role with Super Star) — 10 Roles",
      ngn: "₦1.5M",
      gh: "15,000GH₵",
      usd: "$1,500",
    },
    {
      name: "Unlimited Membership (Lead Role with Star)",
      ngn: "₦12M",
      gh: "120,000GH₵",
      usd: "$12,000",
    },
  ];

  const [form, setForm] = useState<FormFields>({
    name: "",
    membership: "",
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
    if (!form.name || !form.membership || !form.amount || !form.notes) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      // Send the email via your backend
      const res = await axios.post("/api/email", {
        to: "support@bccastings.com", // Your Titan domain email
        subject: "Membership Payment Proof",
        body: `
          A new membership payment was submitted:<br/><br/>
          <b>Name:</b> ${form.name}<br/>
          <b>Membership Type:</b> ${form.membership}<br/>
          <b>Amount Paid:</b> ${form.amount}<br/>
          <b>Notes:</b> ${form.notes}
        `,
      });

      if (res.status !== 200) {
        throw new Error("Failed to send email");
      }
      setMessage("✅ Membership payment proof submitted successfully!");
      setForm({ name: "", membership: "", amount: "", notes: "" });
    } catch (err) {
      setMessage("❌ Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">
          BC CASTINGS — Membership Slots
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Nigeria&apos;s leading casting agency in Lagos & Accra. Get featured
          in Movies, Skits, and Music Videos by securing your Membership Movie
          Role Subscription.
        </p>
      </header>

      <main className="flex flex-col gap-6">
        {/* MEMBERSHIP CARD */}
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1 md:basis-2/3">
            <CardHeader>
              <CardTitle>Membership Packages</CardTitle>
              <CardDescription>Choose your membership tier.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membership</TableHead>
                    <TableHead>Pay in ₦</TableHead>
                    <TableHead>Pay in GH₵</TableHead>
                    <TableHead>Pay in USD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>{m.ngn}</TableCell>
                      <TableCell>{m.gh}</TableCell>
                      <TableCell>{m.usd}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">How to Join:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                  <li>
                    Select your Membership tier and pay to the account below.
                  </li>
                  <li>
                    Send payment evidence (name, amount, date, membership type)
                    to WhatsApp/email.
                  </li>
                  <li>
                    After confirmation, you will be added to the VIP WhatsApp
                    group and receive your membership form + card.
                  </li>
                  <li>
                    Present your card on set to claim roles. Lost cards cost
                    ₦20k. Renewals get 10% discount.
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* PAYMENT CARD */}
          <Card className="flex-1 md:basis-1/3">
            <CardHeader>
              <CardTitle>Payment & Contact</CardTitle>
              <CardDescription>
                Send payments to these accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-sm font-semibold">Pay in Naira</h3>
                <p className="text-sm">Bank: UBA Nigeria</p>
                <p className="text-sm">Account No: 1025207623</p>
                <p className="text-sm">
                  Account Name: BIRA RECRUITING AGENCY LIMITED
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Pay in USD</h3>
                <p className="text-sm">Bank: Zenith Bank Nigeria</p>
                <p className="text-sm">Account No: 1017511611</p>
                <p className="text-sm">Account Name: BUMSHALALA RECORDS</p>
                <p className="text-sm">Sort Code: 015151096</p>
                <p className="text-sm">Swift Code: ZEIBNGLA</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Pay in GH₵</h3>
                <p className="text-sm">Bank: Access Bank Ghana</p>
                <p className="text-sm">Account No: 1036000004690</p>
                <p className="text-sm">
                  Account Name: Bira Bumshalala Int&apos;l LTD
                </p>
                <p className="text-sm">Swift Code: ABNGGHAC</p>
                <p className="text-sm">Sort Code: 280125</p>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} />
                  <a
                    href="mailto:Support@bccastings.com"
                    className="underline break-all"
                  >
                    Support@bccastings.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Phone size={16} />
                  <a href="tel:+2347047777561" className="underline">
                    +234 704 777 7561
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* REGISTRATION FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Register / Submit Proof</CardTitle>
            <CardDescription>
              Submit your membership payment proof below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Membership</Label>
                <Select
                  onValueChange={(v) => handleChange("membership", v)}
                  value={form.membership}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Membership" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberships.map((m) => (
                      <SelectItem key={m.name} value={m.name}>
                        {m.name} — {m.ngn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount Paid</Label>
                <Input
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-3">
                <Label>Payment Evidence / Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-3 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setForm({ name: "", membership: "", amount: "", notes: "" })
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
          </CardContent>
        </Card>
      </main>

      <footer className="mt-10 text-sm text-muted-foreground">
        <p>Loss of Membership Card: ₦20,000 | Renewal: 10% Discount</p>
      </footer>
    </div>
  );
}

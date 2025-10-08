"use client";
import { Mail, Phone, MapPin, Instagram, Youtube } from "lucide-react";
import { Tiktok, Whatsapp } from "iconoir-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-5 px-5 md:px-10">
          {/* Get in Touch Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:support@bccatings.com"
                  className="hover:text-foreground transition-colors"
                >
                  support@bccatings.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+2347047777561"
                  className="hover:text-foreground transition-colors"
                >
                  +2347047777561
                </a>
              </div>
              <div className="flex gap-2">
                <MapPin className="h-4 w-4" />
                <span className="flex flex-col">
                  BLOCK 11, LAMRAT PLAZA 54 EGBEDA IDIMU
                  <span>ROAD OJA OLUGBEDE BESIDES FILLING STATION</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Policies</h3>
            <PolicyLinks />
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4">
            <a
              href="https://wa.me/2347047777561"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="WhatsApp"
            >
              <Whatsapp className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@bira2186?_t=ZM-90Jom7zrZHP&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="TikTok"
            >
              <Tiktok className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com/@agencybira86?si=xKktbOoa7UtHer9k"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/agencybira?igsh=Ym5laDlqa3l6MjZh"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} BC Castings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PolicyLinks() {
  const [open, setOpen] = useState(false);
  const [doc, setDoc] = useState<"privacy" | "terms" | null>(null);

  const openDoc = (type: "privacy" | "terms") => {
    setDoc(type);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <p
        onClick={() => openDoc("privacy")}
        className="hover:text-foreground cursor-pointer transition-colors"
      >
        General Policy
      </p>
      <p
        onClick={() => openDoc("terms")}
        className="hover:text-foreground cursor-pointer transition-colors"
      >
        Terms and Conditions
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {doc === "privacy" ? "General Policy" : "Terms and Conditions"}
            </DialogTitle>
          </DialogHeader>
          <iframe
            src={
              doc === "privacy"
                ? "/PrivacyPolicy.pdf"
                : "/TermsAndConditions.pdf"
            }
            className="flex-1 w-full rounded-md"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

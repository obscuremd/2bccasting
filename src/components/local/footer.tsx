/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Mail, Phone, MapPin, Instagram, Youtube } from "lucide-react";
import { Tiktok, Whatsapp } from "iconoir-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";

export function Footer() {
  return (
    <footer className="bg-[#0B0B0C] text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
          {/* Get in Touch Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wide">
              Get in Touch
            </h3>

            <div className="space-y-6 text-sm leading-relaxed ">
              {/* Lagos Office 1 */}
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Lagos Office
                </h4>
                <p className="text-gray-400">
                  BLOCK 11, LAMRAT PLAZA <br />
                  54, Egbeda Idimu Road <br />
                  Off Olugbede Bus-Stop <br />
                  Beside Filling Station <br />
                  EGBEDA, LAGOS
                </p>
              </div>

              {/* Lagos Office 2 */}
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Lagos Office
                </h4>
                <p className="text-gray-400">
                  No 2, Jaiyeoba Road <br />
                  Salami Bus-Stop <br />
                  Behind NNPC Filling Station <br />
                  SHASHA, LAGOS
                </p>
              </div>

              {/* Ghana Office */}
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Ghana Office
                </h4>
                <p className="text-gray-400">‪+233 24 550 0843‬</p>
              </div>

              {/* Help Lines */}
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Help Lines
                </h4>
                <p className="text-gray-400">
                  CALL / WHATSAPP <br />
                  Briget: ‪+234 906 8299 684‬ <br />
                  Peace: ‪+234 816 6771 096‬ <br />
                  Eva: ‪+234 704 7777 561‬ <br />
                  Ghana: ‪+233 24 550 0843‬
                </p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#FF6B00]" />
                <a
                  href="mailto:support@bccastings.com"
                  className="hover:text-white transition-colors"
                >
                  nigeriacasting@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wide">
              Policies
            </h3>
            <PolicyLinks />
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col justify-start items-start gap-6 flex-1">
            <h3 className="text-lg font-semibold text-white uppercase tracking-wide">
              Connect With Us
            </h3>

            <div className="flex gap-4 flex-wrap">
              {/* WhatsApp */}
              <SocialIcon
                href="https://wa.me/2347047777561"
                label="WhatsApp"
                bg="bg-[#25D366]/10"
                hover="hover:bg-[#25D366]/20"
              >
                <Whatsapp className="h-5 w-5 text-[#25D366]" />
              </SocialIcon>

              {/* TikTok */}
              <SocialIcon
                href="https://www.tiktok.com/@bira2186?_t=ZM-90Jom7zrZHP&_r=1"
                label="TikTok"
                bg="bg-[#69C9D0]/10"
                hover="hover:bg-[#EE1D52]/10"
              >
                <Tiktok className="h-5 w-5 text-[#EE1D52] dark:text-[#69C9D0]" />
              </SocialIcon>

              {/* YouTube */}
              <SocialIcon
                href="https://youtube.com/@agencybira86?si=xKktbOoa7UtHer9k"
                label="YouTube"
                bg="bg-[#FF0000]/10"
                hover="hover:bg-[#FF0000]/20"
              >
                <Youtube className="h-5 w-5 text-[#FF0000]" />
              </SocialIcon>

              {/* Instagram */}
              <SocialIcon
                href="https://www.instagram.com/agencybira?igsh=Ym5laDlqa3l6MjZh"
                label="Instagram"
                bg="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
                hover="hover:opacity-90"
              >
                <Instagram className="h-5 w-5 text-white" />
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} BC Castings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* --- Social Icon Component --- */
function SocialIcon({ href, label, bg, hover, children }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`h-10 w-10 rounded-full flex items-center justify-center ${bg} ${hover} transition-all duration-200 hover:scale-105`}
    >
      {children}
    </a>
  );
}

/* --- Policy Links --- */
function PolicyLinks() {
  const [open, setOpen] = useState(false);
  const [doc, setDoc] = useState<"privacy" | "terms" | "PaymentMethods" | null>(
    null
  );

  const openDoc = (type: "privacy" | "terms" | "PaymentMethods") => {
    setDoc(type);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 text-gray-400 text-sm">
      <p
        onClick={() => openDoc("privacy")}
        className="hover:text-white cursor-pointer transition-colors"
      >
        General Policy
      </p>
      <p
        onClick={() => openDoc("terms")}
        className="hover:text-white cursor-pointer transition-colors"
      >
        Terms and Conditions
      </p>
      <p
        onClick={() => openDoc("PaymentMethods")}
        className="hover:text-white cursor-pointer transition-colors"
      >
        Payment Methods
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col bg-white overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">
              {doc === "privacy"
                ? "General Policy"
                : doc === "PaymentMethods"
                ? "Payment Methods"
                : "Terms and Conditions"}
            </DialogTitle>
          </DialogHeader>

          {/* Render PDF inline */}
          <img
            src={
              doc === "privacy"
                ? "/PrivacyYPolicy.jpg"
                : doc === "PaymentMethods"
                ? "/payementmethods.jpg"
                : "/termsandcondition.jpg"
            }
            className="flex-1 w-full rounded-md border border-gray-200"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

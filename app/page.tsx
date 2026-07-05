"use client";

import { useState } from "react";
import RsvpModal from "./components/RsvpModal";
import Footer from "./components/Footer";

export default function HomePage() {
  // Controls whether the RSVP modal is visible
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-amber-100 flex flex-col items-center px-4 py-6">
      {/* ====================================================== */}
      {/* TOP SECTION: Main Invitation Graphic Placeholder        */}
      {/* ====================================================== */}
      {/*
        DESIGNER SPEC — "eli invitation.jpg"
        ------------------------------------------------------
        Recommended export settings from Canva:
          - Dimensions: 1080px (width) x 1350px (height)
            -> This is a 4:5 portrait ratio, ideal for mobile
               screens and matches Instagram portrait posts.
          - Format: JPG (use JPG for photos/illustrations with
            lots of color; use PNG only if you need transparency)
          - Max file size: under 500KB for fast mobile loading
            (use Canva's "Compress" download option, or run it
            through tinypng.com after exporting)
          - Color mode: RGB (not CMYK)
          - File name: eli-invitation.jpg
          - Place the final file in: /public/eli-invitation.jpg
        ------------------------------------------------------
        Once you have the real image, replace the placeholder
        <div> below with:

          <img
            src="/eli-invitation.jpg"
            alt="Eli's One Piece Birthday Invitation"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
      */}
      <div className="w-full max-w-md aspect-[4/5] bg-blue-950/40 border-amber-300 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-lg">
        <img
          src="/eli_invitation.jpg"
          alt="Eli's One Piece Birthday Invitation"
          className="w-full h-auto rounded-2xl shadow-lg"
        />
      </div>

      {/* ====================================================== */}
      {/* MIDDLE SECTION: Call-to-Action Button                   */}
      {/* ====================================================== */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 w-full max-w-md bg-amber-400 hover:bg-amber-300 active:scale-95
                   text-blue-950 font-extrabold text-xl py-4 px-6 rounded-full
                   shadow-[0_6px_0_0_rgba(146,64,14,0.8)] active:shadow-[0_2px_0_0_rgba(146,64,14,0.8)]
                   active:translate-y-1 transition-all duration-150
                   border-2 border-blue-950 tracking-wide"
      >
        ⚓ RSVP to the Crew
      </button>

      <Footer />

      {/* RSVP Modal — only rendered logic lives inside the component,
          but it controls its own visibility via the isOpen prop */}
      <RsvpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eli's Birthday RSVP",
  description: "RSVP for Eli's One Piece themed birthday celebration!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

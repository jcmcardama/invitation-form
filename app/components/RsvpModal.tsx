"use client";

import { useState } from "react";
import GuestRow from "./GuestRow";
import { Guest, RsvpSubmission } from "./types";

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to create a blank guest. We use a timestamp + random string
// as the "id" so React can tell guests apart even if their names match.
function createBlankGuest(): Guest {
  return {
    id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    firstName: "",
    lastName: "",
    guestType: "Adult",
  };
}

export default function RsvpModal({ isOpen, onClose }: RsvpModalProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState<Guest[]>([createBlankGuest()]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  function handleAddGuest() {
    setGuests((prev) => [...prev, createBlankGuest()]);
  }

  // Updates one specific guest's fields without touching the others.
  // We find the guest by id and merge in only the changed fields.
  function handleGuestChange(id: string, updatedFields: Partial<Guest>) {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updatedFields } : g))
    );
  }

  function handleRemoveGuest(id: string) {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }

  const adultCount = guests.filter((g) => g.guestType === "Adult").length;
  const kidCount = guests.filter((g) => g.guestType === "Kid").length;
  const totalCount = guests.length;

  function buildCounterText() {
    const parts: string[] = [];
    if (adultCount > 0) parts.push(`${adultCount} adult${adultCount > 1 ? "s" : ""}`);
    if (kidCount > 0) parts.push(`${kidCount} kid${kidCount > 1 ? "s" : ""}`);
    const breakdown = parts.length > 0 ? ` (${parts.join(", ")})` : "";
    return `Submit for ${totalCount} ${totalCount === 1 ? "person" : "people"}${breakdown}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (attending === null) {
      setErrorMsg("Please choose whether you're attending.");
      return;
    }

    const payload: RsvpSubmission = {
      attending,
      guests: attending ? guests : [],
      message,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Resets everything and closes — used after success or manual close
  function handleClose() {
    onClose();
    // Slight delay so the modal doesn't visibly "flash" reset before closing
    setTimeout(() => {
      setAttending(null);
      setGuests([createBlankGuest()]);
      setMessage("");
      setIsSubmitted(false);
      setErrorMsg("");
    }, 300);
  }

  return (
    // Overlay backdrop
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl
                   max-h-[90vh] overflow-y-auto animate-slide-up"
      >
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-48 h-48 flex items-center justify-center mb-6">
              <img
                src="/eli-thank-you.png"
                alt="Eli's One Piece Birthday Sucess"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-blue-900 mb-2">
              {attending ? "Welcome to the Crew!" : "Thanks for letting us know!"}
            </h2>
            <p className="text-blue-700 mb-6">
              {attending
                ? "See you there, Nakama!"
                : "We'll miss you, but thank you for the message!"}
            </p>
            <button
              onClick={handleClose}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold text-blue-900">
                ⚓ RSVP
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`py-3 rounded-xl font-semibold border-2 transition-colors
                  ${
                    attending === true
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-green-700 border-green-400"
                  }`}
              >
                ✅ I will be attending
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`py-3 rounded-xl font-semibold border-2 transition-colors
                  ${
                    attending === false
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-red-600 border-red-300"
                  }`}
              >
                ❌ I cannot attend
              </button>
            </div>

            {attending === false && (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">
                    Message for Eli
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Wishing you a wonderful day!"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {attending === true && (
              <div className="mb-4">
                {guests.map((guest, index) => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    index={index}
                    onChange={handleGuestChange}
                    onRemove={handleRemoveGuest}
                    canRemove={guests.length > 1}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="w-full border-2 border-dashed border-blue-400 text-blue-700 font-medium
                             py-2 rounded-xl mb-4 hover:bg-blue-50 transition-colors"
                >
                  + Add more guests
                </button>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">
                    Message for Eli
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Can't wait to celebrate with you!"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {attending !== null && (
              <>
                {attending === true && (
                  <p className="text-center text-sm font-semibold text-blue-800 bg-blue-50 rounded-lg py-2 mb-3">
                    {buildCounterText()}
                  </p>
                )}

                {errorMsg && (
                  <p className="text-red-600 text-sm text-center mb-3">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60
                             text-blue-950 font-extrabold py-3 rounded-full border-2 border-blue-950
                             transition-colors"
                >
                  {isSubmitting ? "Sending..." : "Submit RSVP"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

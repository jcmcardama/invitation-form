"use client";

import { Guest } from "./types";

// Props this component expects to receive from its parent (RsvpModal)
interface GuestRowProps {
  guest: Guest;
  index: number;
  onChange: (id: string, updatedFields: Partial<Guest>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean; // we don't allow removing the very last remaining guest
}

// This component renders ONE guest's set of fields:
// First Name, Last Name, and an Adult/Kid toggle.
// It is "dumb" — it doesn't hold its own state, it just displays
// whatever data the parent gives it and reports changes upward.
export default function GuestRow({
  guest,
  index,
  onChange,
  onRemove,
  canRemove,
}: GuestRowProps) {
  return (
    <div className="border border-blue-200 rounded-xl p-4 mb-3 bg-blue-50/60 relative">
      <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
        Guest {index + 1}
      </p>

      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(guest.id)}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm font-bold"
          aria-label="Remove guest"
        >
          ✕
        </button>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input
          type="text"
          placeholder="First Name"
          value={guest.firstName}
          onChange={(e) => onChange(guest.id, { firstName: e.target.value })}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={guest.lastName}
          onChange={(e) => onChange(guest.id, { lastName: e.target.value })}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Adult / Kid selector, styled as toggle-like radio buttons */}
      <div className="flex gap-2">
        {(["Adult", "Kid"] as const).map((type) => (
          <label
            key={type}
            className={`flex-1 text-center py-2 rounded-lg text-sm font-medium cursor-pointer border transition-colors
              ${
                guest.guestType === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-700 border-blue-300"
              }`}
          >
            <input
              type="radio"
              name={`guestType-${guest.id}`}
              value={type}
              checked={guest.guestType === type}
              onChange={() => onChange(guest.id, { guestType: type })}
              className="hidden"
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
}

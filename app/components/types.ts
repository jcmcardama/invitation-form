// This file defines the "shapes" of our data using TypeScript types.
// Think of a type as a blueprint that describes what fields an object
// must have. This helps catch mistakes early (e.g. typos in field names)
// before the app even runs.

// A single guest entry in the "attending" form
export interface Guest {
  id: string; // unique identifier so React can track each guest row
  firstName: string;
  lastName: string;
  guestType: "Adult" | "Kid";
}

// The full payload we send to our API route / Google Sheet
export interface RsvpSubmission {
  attending: boolean;
  guests: Guest[]; // empty array if not attending
  message: string;
  dietaryRestrictions: string;
}

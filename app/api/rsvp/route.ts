// This file runs on the SERVER, not in the browser. That means it's
// safe to use secret credentials here — they never get sent to the
// visitor's device.
//
// It receives the RSVP form data (as JSON) and writes ONE row into
// a Google Sheet using the `google-spreadsheet` npm package.

import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// The shape of data we expect to receive from the frontend.
// (Duplicated here intentionally — API routes shouldn't import
// frontend-only files to keep server and client code separate.)
interface Guest {
  firstName: string;
  lastName: string;
  guestType: "Adult" | "Kid";
}

interface RsvpSubmission {
  attending: boolean;
  guests: Guest[];
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RsvpSubmission = await request.json();

    // Basic validation — never trust data from the client blindly
    if (typeof body.attending !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid 'attending' field." },
        { status: 400 }
      );
    }

    // --------------------------------------------------------------
    // AUTHENTICATE with Google using a "Service Account".
    // A service account is like a robot user that only your server
    // knows about — it has its own email address and private key,
    // which you'll generate in Google Cloud Console (see README).
    // --------------------------------------------------------------
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID as string,
      serviceAccountAuth
    );

    await doc.loadInfo(); // fetches sheet metadata
    const sheet = doc.sheetsByIndex[0]; // uses the first tab in the spreadsheet

    // --------------------------------------------------------------
    // BUILD ONE ROW (Option A: one row per submission)
    // Instead of creating a separate row per guest, we flatten the
    // entire guest list into a single readable text string and store
    // it in one cell. This avoids duplicate/multiple rows per family
    // and keeps each submission as a single, clean record.
    // --------------------------------------------------------------
    const guestSummary = body.attending
      ? body.guests
          .map(
            (g, i) =>
              `${i + 1}. ${g.firstName} ${g.lastName} (${g.guestType})`
          )
          .join(" | ")
      : "";

    const adultCount = body.guests.filter((g) => g.guestType === "Adult").length;
    const kidCount = body.guests.filter((g) => g.guestType === "Kid").length;

    await sheet.addRow({
      Timestamp: new Date().toISOString(),
      Attending: body.attending ? "Yes" : "No",
      TotalGuests: body.attending ? body.guests.length : 0,
      AdultCount: adultCount,
      KidCount: kidCount,
      GuestDetails: guestSummary, // e.g. "1. Jane Doe (Adult) | 2. Tim Doe (Kid)"
      Message: body.message || "",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { error: "Failed to save RSVP. Please try again." },
      { status: 500 }
    );
  }
}

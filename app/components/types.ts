export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: "Adult" | "Kid";
}

export interface RsvpSubmission {
  attending: boolean;
  guests: Guest[];
  message: string;
}

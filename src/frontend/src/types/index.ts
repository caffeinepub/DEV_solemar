export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guestCount: number;
  name: string;
  email: string;
}

export interface BookingResult {
  reference: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  name: string;
  email: string;
  tweetPosted?: boolean;
  tweetError?: string;
}

export interface OAuthStatus {
  connected: boolean;
  username?: string;
  clientId?: string | null;
}

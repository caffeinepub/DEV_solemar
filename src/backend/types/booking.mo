// types/booking.mo — booking domain type definitions
module {
  public type BookingId = Text; // SOL-XXXXXX format

  public type Booking = {
    id : BookingId;
    checkIn : Text;
    checkOut : Text;
    guestCount : Nat;
    name : Text;
    email : Text;
    createdAt : Int; // Timestamp (nanoseconds)
  };
};

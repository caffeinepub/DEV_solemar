// lib/booking.mo — booking domain logic
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Types "../types/booking";

module {
  public type Booking = Types.Booking;

  // Base-36 alphabet for reference codes
  let alphabet : [Char] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
    'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z',
  ];

  /// Generate a unique booking reference code in SOL-XXXXXX format
  public func generateRef(seed : Nat) : Text {
    var n = seed;
    var code = "";
    let base = alphabet.size();
    // Build 6 characters by treating seed as base-N number
    var i = 0;
    while (i < 6) {
      let idx = n % base;
      code := Text.fromChar(alphabet[idx]) # code;
      n := n / base;
      i += 1;
    };
    "SOL-" # code
  };

  /// Create a new booking record
  public func create(
    id : Text,
    checkIn : Text,
    checkOut : Text,
    guestCount : Nat,
    name : Text,
    email : Text,
    createdAt : Int,
  ) : Booking {
    { id; checkIn; checkOut; guestCount; name; email; createdAt }
  };

  /// Find a booking by reference id
  public func findById(bookings : List.List<Booking>, id : Text) : ?Booking {
    bookings.find(func(b) { b.id == id })
  };

  /// Return all bookings as an array
  public func listAll(bookings : List.List<Booking>) : [Booking] {
    bookings.toArray()
  };
};

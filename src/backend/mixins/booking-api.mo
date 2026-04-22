// mixins/booking-api.mo — public booking API endpoints
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import BookingLib "../lib/booking";
import TwitterLib "../lib/twitter";
import BookingTypes "../types/booking";
import TwitterTypes "../types/twitter";

mixin (
  accessControlState : AccessControl.AccessControlState,
  bookings : List.List<BookingTypes.Booking>,
  bookingCounter : { var value : Nat },
  tokenStore : Map.Map<Principal, TwitterTypes.OAuthTokens>,
  xClientId : { var value : ?Text },
) {
  /// Submit a new booking; auto-posts a tweet on success.
  /// Returns the SOL-XXXXXX reference code regardless of tweet result.
  public shared ({ caller = _ }) func createBooking(
    checkIn : Text,
    checkOut : Text,
    guestCount : Nat,
    name : Text,
    email : Text,
  ) : async Text {
    // Generate reference and store booking
    let seed = bookingCounter.value;
    bookingCounter.value += 1;
    let id = BookingLib.generateRef(seed);
    let booking = BookingLib.create(id, checkIn, checkOut, guestCount, name, email, Time.now());
    bookings.add(booking);

    // Attempt tweet — use the first connected principal's tokens if available
    let now = Time.now();
    switch (xClientId.value) {
      case (?clientId) {
        // Find first principal with tokens
        let firstEntry = tokenStore.entries().next();
        switch (firstEntry) {
          case (?(principal, _)) {
            switch (await* TwitterLib.getValidTokens(tokenStore, clientId, principal, now)) {
              case (?validTokens) {
                let tweetText = "🌊 New booking at Solemar, Muro Alto! Another guest is heading to paradise! 🏖️ #Solemar #MuroAlto #Brazil";
                ignore await* TwitterLib.postTweet(validTokens.accessToken, tweetText);
              };
              case null {};
            };
          };
          case null {};
        };
      };
      case null {};
    };

    id
  };
};

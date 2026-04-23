// main.mo — composition root; owns all state, delegates to mixins
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import BookingTypes "types/booking";
import TwitterTypes "types/twitter";
import BookingApi "mixins/booking-api";
import TwitterApi "mixins/twitter-api";
// migration.mo kept in codebase but no longer attached to the actor
// 

actor {
  stable var accessControlState = AccessControl.initState();

  // One-time postupgrade hook: reset adminAssigned if the anonymous principal
  // claimed the slot (or if userRoles has no admin), so the first real login
  // can be promoted to admin via the first-caller-wins pattern.
  system func postupgrade() {
    // admin state is managed by _initializeAccessControl first-caller-wins logic
  };
  include MixinAuthorization(accessControlState);

  // — Booking state —
  let bookings = List.empty<BookingTypes.Booking>();
  let bookingCounter = { var value : Nat = 0 };

  // — Twitter/X OAuth state —
  let tokenStore = Map.empty<Principal, TwitterTypes.OAuthTokens>();
  let pkceSessionStore = Map.empty<Principal, TwitterTypes.PkceSession>();
  let xClientId = { var value : ?Text = null };

  include BookingApi(accessControlState, bookings, bookingCounter, tokenStore, xClientId);
  include TwitterApi(accessControlState, tokenStore, pkceSessionStore, xClientId);

  // — HTTP interface (for CSP headers on asset requests) —
  type HttpRequest = {
    method : Text;
    url : Text;
    headers : [(Text, Text)];
    body : Blob;
  };
  type HttpResponse = {
    status_code : Nat16;
    headers : [(Text, Text)];
    body : Blob;
    upgrade : ?Bool;
  };

  // One-shot bootstrap: directly assign a principal as admin in stable storage,
  // bypassing first-caller-wins. REMOVE this function in the next deploy after use.
  public shared func forceSetAdmin(p : Principal) : async () {
    accessControlState.userRoles.add(p, #admin);
    accessControlState.adminAssigned := true;
  };

  // Update-call variant of isCallerAdmin so the canister sees the real caller identity
  // (query calls are unauthenticated on ICP and always receive the anonymous principal).
  public shared ({ caller }) func isCallerAdminUpdate() : async Bool {
    try {
      return AccessControl.isAdmin(accessControlState, caller);
    } catch (_) {
      return false;
    };
  };

  public query func http_request(_req : HttpRequest) : async HttpResponse {
    {
      status_code = 200;
      headers = [
        ("Content-Type", "text/plain"),
        ("Content-Security-Policy", "default-src 'self'; img-src https: data:; connect-src 'self'"),
      ];
      body = "Solemar API".encodeUtf8();
      upgrade = null;
    }
  };
};

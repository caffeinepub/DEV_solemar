// migration.mo — Step 1 of stable memory cleanup:
// Explicitly drops `accessControlState` and `rawRand` stable slots from the
// previous version so the upgrade can proceed without M0169 errors.
// Step 2 will re-add caffeineai-authorization with fresh state.
import Map "mo:core/Map";

module {
  // Old types defined inline (from .old/src/backend/dist/backend.most)
  type OldUserRole = { #admin; #guest; #user };
  type OldAccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, OldUserRole>;
  };

  // OldActor: all stable fields from the previous version.
  // rawRand uses its exact old type so the compatibility checker accepts the drop.
  type OldActor = {
    accessControlState : OldAccessControlState;
    rawRand : shared () -> async Blob;
    // Remaining fields are pass-through (inherited, not consumed here)
  };

  // NewActor: empty — we are only dropping fields, not producing new ones.
  // All surviving fields (bookings, bookingCounter, tokenStore, etc.) are
  // inherited by the actor from the previous version without transformation.
  type NewActor = {};

  public func run(_old : OldActor) : NewActor {
    // Drop accessControlState and rawRand; all other fields are inherited.
    {};
  };
};

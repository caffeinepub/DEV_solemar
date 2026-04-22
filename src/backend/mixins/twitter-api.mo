// mixins/twitter-api.mo — public Twitter/X OAuth admin API endpoints
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Debug "mo:core/Debug";
import Error "mo:core/Error";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import TwitterLib "../lib/twitter";
import CommonTypes "../types/common";
import TwitterTypes "../types/twitter";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tokenStore : Map.Map<Principal, TwitterTypes.OAuthTokens>,
  pkceSessionStore : Map.Map<Principal, TwitterTypes.PkceSession>,
  xClientId : { var value : ?Text },
) {
  // Management canister raw_rand for entropy
  let rawRand = (actor "aaaaa-aa" : actor { raw_rand : () -> async Blob }).raw_rand;

  /// Admin only: set the Twitter OAuth Client ID
  public shared ({ caller }) func setXClientId(clientId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set the Twitter Client ID");
    };
    xClientId.value := ?clientId;
  };

  /// Admin only: retrieve the Twitter OAuth Client ID (masked for security)
  public query ({ caller }) func getXClientId() : async ?Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view the Twitter Client ID");
    };
    switch (xClientId.value) {
      case null null;
      case (?id) {
        // Mask: show first 4 chars + "..." for non-empty IDs
        let preview = if (id.size() > 4) {
          var pre = "";
          var i = 0;
          for (c in id.toIter()) {
            if (i < 4) { pre #= Text.fromChar(c); i += 1 };
          };
          pre # "..."
        } else { "***" };
        ?preview
      };
    }
  };

  /// Admin only: begin PKCE OAuth flow — returns auth URL, state, and code verifier
  public shared ({ caller }) func getOAuthStartParams(redirectUri : Text) : async TwitterTypes.OAuthStartParams {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can start OAuth flow");
    };
    let clientId = switch (xClientId.value) {
      case (?id) id;
      case null Runtime.trap("Twitter Client ID not configured. Set it via setXClientId first.");
    };

    Debug.print("[OAuth] Starting PKCE flow for " # caller.toText());

    // Get entropy for verifier (32 bytes) and state (16 bytes) — need 48 bytes
    let entropy = await rawRand();
    let entropyBytes = entropy.toArray();
    // Use first 32 bytes for code verifier, next 16 for state
    let verifierEntropy = Blob.fromArray(
      if (entropyBytes.size() >= 32) entropyBytes.sliceToArray(0, 32)
      else entropyBytes
    );
    let stateEntropy = Blob.fromArray(
      if (entropyBytes.size() >= 48) entropyBytes.sliceToArray(32, 48)
      else if (entropyBytes.size() >= 16) entropyBytes.sliceToArray(0, 16)
      else entropyBytes
    );

    let codeVerifier = TwitterLib.generateCodeVerifier(verifierEntropy);
    let challenge = TwitterLib.codeChallenge(codeVerifier);
    let state = TwitterLib.generateState(stateEntropy);
    let authUrl = TwitterLib.buildAuthUrl(clientId, redirectUri, state, challenge);

    // Store session with redirect URI for use in completeOAuth
    pkceSessionStore.add(caller, { codeVerifier; state; redirectUri });

    Debug.print("[OAuth] PKCE params generated, state=" # state);
    { authUrl; state; codeVerifier }
  };

  /// Admin only: complete OAuth flow by exchanging code for tokens
  public shared ({ caller }) func completeOAuth(code : Text, state : Text) : async CommonTypes.Result {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can complete OAuth flow");
    };
    let clientId = switch (xClientId.value) {
      case (?id) id;
      case null return #err("Twitter Client ID not configured");
    };
    let session = switch (pkceSessionStore.get(caller)) {
      case (?s) s;
      case null return #err("No active OAuth session. Call getOAuthStartParams first.");
    };
    if (session.state != state) {
      return #err("OAuth state mismatch — possible CSRF attack");
    };

    Debug.print("[OAuth] Completing OAuth for " # caller.toText());

    try {
      let tokens = await* TwitterLib.exchangeCode(clientId, code, session.codeVerifier, session.redirectUri);
      tokenStore.add(caller, tokens);
      pkceSessionStore.remove(caller);
      Debug.print("[OAuth] OAuth complete for " # caller.toText());
      #ok("Twitter connected successfully")
    } catch (e) {
      let msg = e.message();
      Debug.print("[OAuth] OAuth failed for " # caller.toText() # ": " # msg);
      #err(msg)
    }
  };

  /// Admin only: disconnect Twitter for the calling principal
  public shared ({ caller }) func disconnectTwitter() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can disconnect Twitter");
    };
    tokenStore.remove(caller);
    Debug.print("[OAuth] Twitter disconnected for " # caller.toText());
  };

  /// Admin only: check Twitter connection status for the calling principal
  public query ({ caller }) func getTwitterStatus() : async TwitterTypes.TwitterStatus {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view Twitter status");
    };
    let connected = tokenStore.containsKey(caller);
    { connected; username = null }
  };
};

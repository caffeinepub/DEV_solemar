// lib/twitter.mo — Twitter/X OAuth and tweet domain logic using x-client
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Char "mo:core/Char";
import Debug "mo:core/Debug";
import Error "mo:core/Error";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Nat8 "mo:core/Nat8";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Sha256 "mo:sha2/Sha256";
import TweetsApi "mo:x-client/Apis/TweetsApi";
import XConfig "mo:x-client/Config";
import { type TweetCreateRequest } "mo:x-client/Models/TweetCreateRequest";
import Types "../types/twitter";

module {
  public type OAuthTokens = Types.OAuthTokens;
  public type PkceSession = Types.PkceSession;
  public type OAuthStartParams = Types.OAuthStartParams;
  public type TwitterStatus = Types.TwitterStatus;
  public type TweetResult = Types.TweetResult;

  // Management canister types for OAuth HTTP calls
  type HttpHeader = { name : Text; value : Text };
  type HttpMethod = { #get; #head; #post };
  type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    method : HttpMethod;
    headers : [HttpHeader];
    body : ?Blob;
    transform : ?{
      function : shared query ({ response : HttpResult; context : Blob }) -> async HttpResult;
      context : Blob;
    };
    is_replicated : ?Bool;
  };
  type HttpResult = { status : Nat; headers : [HttpHeader]; body : Blob };

  let httpRequest = (actor "aaaaa-aa" : actor { http_request : (HttpRequestArgs) -> async HttpResult }).http_request;

  // Base64url alphabet bytes (RFC 4648 §5, URL-safe, no padding):
  // A-Z = 65-90, a-z = 97-122, 0-9 = 48-57, - = 45, _ = 95
  let b64urlAlpha : [Nat8] = [
    65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
    78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
    97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
    110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
    45, 95,
  ];

  /// Encode a Blob as base64url (no padding)
  func base64url(data : Blob) : Text {
    let bytes = data.toArray();
    let n = bytes.size();
    var i = 0;
    var result = "";
    while (i < n) {
      let b0 = bytes[i].toNat();
      let b1 = if (i + 1 < n) bytes[i + 1].toNat() else 0;
      let b2 = if (i + 2 < n) bytes[i + 2].toNat() else 0;
      let triple = b0 * 65536 + b1 * 256 + b2;
      let ch0 = b64urlAlpha[(triple / 262144) % 64];
      let ch1 = b64urlAlpha[(triple / 4096) % 64];
      let ch2 = b64urlAlpha[(triple / 64) % 64];
      let ch3 = b64urlAlpha[triple % 64];
      let blob0 = Blob.fromArray([ch0]);
      let blob1 = Blob.fromArray([ch1]);
      let blob2 = Blob.fromArray([ch2]);
      let blob3 = Blob.fromArray([ch3]);
      let s0 = switch (blob0.decodeUtf8()) { case (?t) t; case null "" };
      let s1 = switch (blob1.decodeUtf8()) { case (?t) t; case null "" };
      let s2 = if (i + 1 < n) switch (blob2.decodeUtf8()) { case (?t) t; case null "" } else "";
      let s3 = if (i + 2 < n) switch (blob3.decodeUtf8()) { case (?t) t; case null "" } else "";
      result #= s0 # s1 # s2 # s3;
      i += 3;
    };
    result
  };

  /// Generate a PKCE code verifier from 32 random bytes, base64url-encoded
  public func generateCodeVerifier(entropy : Blob) : Text {
    base64url(entropy)
  };

  /// Derive code challenge from code verifier via S256 (SHA-256 then base64url, no padding)
  public func codeChallenge(verifier : Text) : Text {
    let hash = Sha256.fromBlob(#sha256, verifier.encodeUtf8());
    base64url(hash)
  };

  /// Generate a random state parameter from the first 16 bytes of entropy
  public func generateState(entropy : Blob) : Text {
    let bytes = entropy.toArray();
    let slice = if (bytes.size() >= 16) bytes.sliceToArray(0, 16) else bytes;
    base64url(Blob.fromArray(slice))
  };

  /// Build the Twitter OAuth 2.0 PKCE authorization URL
  public func buildAuthUrl(clientId : Text, redirectUri : Text, state : Text, codeChallenge_ : Text) : Text {
    "https://twitter.com/i/oauth2/authorize" #
    "?response_type=code" #
    "&client_id=" # uriEncode(clientId) #
    "&redirect_uri=" # uriEncode(redirectUri) #
    "&scope=" # uriEncode("tweet.read tweet.write users.read offline.access") #
    "&state=" # state #
    "&code_challenge=" # codeChallenge_ #
    "&code_challenge_method=S256"
  };

  /// Percent-encode characters that are not safe in query parameter values
  func uriEncode(s : Text) : Text {
    var result = "";
    for (c in s.toIter()) {
      let code = c.toNat32().toNat();
      let safe = (c >= 'A' and c <= 'Z') or
                 (c >= 'a' and c <= 'z') or
                 (c >= '0' and c <= '9') or
                 c == '-' or c == '_' or c == '.' or c == '~';
      if (safe) {
        result #= Text.fromChar(c);
      } else {
        // percent-encode as %XX
        let high = code / 16;
        let low = code % 16;
        let hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        result #= "%" # Text.fromChar(hexDigits[high]) # Text.fromChar(hexDigits[low]);
      };
    };
    result
  };

  /// Exchange authorization code for OAuth tokens via HTTP outcall to token endpoint.
  /// Budget: 200M cycles.
  public func exchangeCode(
    clientId : Text,
    code : Text,
    codeVerifier : Text,
    redirectUri : Text,
  ) : async* OAuthTokens {
    let body = "grant_type=authorization_code" #
               "&code=" # uriEncode(code) #
               "&redirect_uri=" # uriEncode(redirectUri) #
               "&client_id=" # uriEncode(clientId) #
               "&code_verifier=" # uriEncode(codeVerifier);

    Debug.print("[OAuth] Exchanging code for tokens, client_id=" # clientId);

    let request : HttpRequestArgs = {
      url = "https://api.x.com/2/oauth2/token";
      max_response_bytes = ?8192;
      method = #post;
      headers = [{ name = "Content-Type"; value = "application/x-www-form-urlencoded" }];
      body = ?body.encodeUtf8();
      transform = null;
      is_replicated = null;
    };

    let response = await (with cycles = 200_000_000) httpRequest(request);
    let responseText = switch (response.body.decodeUtf8()) { case (?t) t; case null "" };
    Debug.print("[OAuth] Token exchange status=" # response.status.toText() # " body=" # responseText);

    if (response.status < 200 or response.status >= 300) {
      throw Error.reject("[OAuth] Token exchange failed: HTTP " # response.status.toText() # ": " # responseText);
    };
    parseTokenResponse(responseText)
  };

  /// Refresh an expired access token via HTTP outcall.
  /// Budget: 200M cycles.
  public func refreshTokens(
    clientId : Text,
    refreshToken_ : Text,
  ) : async* OAuthTokens {
    let body = "grant_type=refresh_token" #
               "&refresh_token=" # uriEncode(refreshToken_) #
               "&client_id=" # uriEncode(clientId);

    Debug.print("[OAuth] Refreshing tokens, client_id=" # clientId);

    let request : HttpRequestArgs = {
      url = "https://api.x.com/2/oauth2/token";
      max_response_bytes = ?8192;
      method = #post;
      headers = [{ name = "Content-Type"; value = "application/x-www-form-urlencoded" }];
      body = ?body.encodeUtf8();
      transform = null;
      is_replicated = null;
    };

    let response = await (with cycles = 200_000_000) httpRequest(request);
    let responseText = switch (response.body.decodeUtf8()) { case (?t) t; case null "" };
    Debug.print("[OAuth] Refresh status=" # response.status.toText() # " body=" # responseText);

    if (response.status < 200 or response.status >= 300) {
      throw Error.reject("[OAuth] Token refresh failed: HTTP " # response.status.toText() # ": " # responseText);
    };
    parseTokenResponse(responseText)
  };

  /// Parse a JSON token response — extracts access_token, refresh_token, expires_in.
  /// Uses simple string splitting on the flat JSON structure Twitter returns.
  func parseTokenResponse(json : Text) : OAuthTokens {
    let accessToken = extractAfterKey(json, "access_token");
    let refreshToken = extractAfterKey(json, "refresh_token");
    let expiresInText = extractAfterKey(json, "expires_in");
    let expiresIn : Int = switch (Int.fromText(expiresInText)) {
      case (?n) n;
      case null 7200;
    };
    let expiresAt = Time.now() + (expiresIn * 1_000_000_000);
    { accessToken; refreshToken; expiresAt }
  };

  /// Find the value after `"<key>":` in a JSON object.
  /// Works for both string values (returns content between quotes) and number values.
  func extractAfterKey(json : Text, key : Text) : Text {
    // Find position of the pattern: "key":
    let marker = "\"" # key # "\":";
    // Tokenize by splitting on the marker
    let parts = json.split(#text marker);
    // Skip first part (before the marker), get second
    switch (parts.next()) {
      case null return "";
      case (?_before) {};
    };
    let after = switch (parts.next()) {
      case (?a) a;
      case null return "";
    };
    // Strip leading whitespace and optional space after colon
    var trimmed = after;
    // Check if it starts with a quote (string value) or digit/minus (number)
    let afterChars = after.toArray();
    if (afterChars.size() == 0) return "";
    let first = afterChars[0];
    if (first == ' ') {
      // trim one leading space
      trimmed := Text.fromArray(afterChars.sliceToArray(1, afterChars.size()));
    };
    let trimChars = trimmed.toArray();
    if (trimChars.size() == 0) return "";
    // String value: extract between outer quotes
    // We use splitOnce by looking for the closing quote
    let dq : Nat32 = 34; // ASCII double-quote
    if (trimChars[0].toNat32() == dq) {
      // read until next unescaped quote
      var result = "";
      var i = 1;
      let sz = trimChars.size();
      while (i < sz and trimChars[i].toNat32() != dq) {
        result #= Text.fromChar(trimChars[i]);
        i += 1;
      };
      result
    } else {
      // Number value: read until comma, }, or space
      var result = "";
      var i = 0;
      let sz = trimChars.size();
      while (i < sz and trimChars[i] != ',' and trimChars[i] != '}' and trimChars[i] != ' ') {
        result #= Text.fromChar(trimChars[i]);
        i += 1;
      };
      result
    }
  };

  /// Post a tweet via x-client TweetsApi.createPosts — NEVER raw http_request for tweets.
  /// Budget: 25B cycles.
  public func postTweet(accessToken : Text, text : Text) : async* TweetResult {
    let config : XConfig.Config = {
      XConfig.defaultConfig with
      auth = ?#bearer(accessToken);
      cycles = 25_000_000_000;
    };
    let req : TweetCreateRequest = {
      text_ = ?text;
      card_uri = null;
      community_id = null;
      direct_message_deep_link = null;
      edit_options = null;
      for_super_followers_only = null;
      geo = null;
      made_with_ai = null;
      media = null;
      nullcast = null;
      paid_partnership = null;
      poll = null;
      quote_tweet_id = null;
      reply = null;
      reply_settings = null;
      share_with_followers = null;
    };

    Debug.print("[Tweet Debug] Request: text=\"" # text # "\" bearer_prefix=" # textFirst8(accessToken));

    try {
      let response = await* TweetsApi.createPosts(config, req);
      let tweetId = switch (response.data) {
        case (?d) d.id;
        case null "unknown";
      };
      Debug.print("[Tweet Debug] Response: success, tweet_id=" # tweetId);
      #ok(tweetId)
    } catch (e) {
      let msg = e.message();
      Debug.print("[Tweet Debug] Response: error=" # msg);
      #err(msg)
    }
  };

  func textFirst8(t : Text) : Text {
    var result = "";
    var i = 0;
    for (c in t.toIter()) {
      if (i < 8) { result #= Text.fromChar(c); i += 1 };
    };
    result # "..."
  };

  /// Determine if tokens are expired (with 60s safety buffer)
  public func isExpired(tokens : OAuthTokens, now : Int) : Bool {
    let bufferNs : Int = 60 * 1_000_000_000;
    now + bufferNs >= tokens.expiresAt
  };

  /// Retrieve valid (possibly refreshed) tokens for a principal.
  /// Auto-refreshes if near expiry. Returns null if no tokens stored or refresh fails.
  public func getValidTokens(
    tokenStore : Map.Map<Principal, OAuthTokens>,
    clientId : Text,
    caller : Principal,
    now : Int,
  ) : async* ?OAuthTokens {
    switch (tokenStore.get(caller)) {
      case null null;
      case (?tokens) {
        if (isExpired(tokens, now)) {
          try {
            let fresh = await* refreshTokens(clientId, tokens.refreshToken);
            tokenStore.add(caller, fresh);
            ?fresh
          } catch (e) {
            Debug.print("[OAuth] Auto-refresh failed for " # caller.toText() # ": " # e.message());
            null
          }
        } else {
          ?tokens
        }
      };
    }
  };
};

// types/twitter.mo — Twitter/X OAuth and token domain type definitions
module {
  public type OAuthTokens = {
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Int; // Timestamp (nanoseconds) when access token expires
  };

  public type PkceSession = {
    codeVerifier : Text;
    state : Text;
    redirectUri : Text;
  };

  public type OAuthStartParams = {
    authUrl : Text;
    state : Text;
    codeVerifier : Text;
  };

  public type TwitterStatus = {
    connected : Bool;
    username : ?Text;
  };

  public type TweetResult = {
    #ok : Text;  // tweet id
    #err : Text; // error message
  };
};

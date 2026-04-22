// types/common.mo — cross-cutting types shared across domains
module {
  public type Timestamp = Int;

  public type Result = {
    #ok : Text;
    #err : Text;
  };
};

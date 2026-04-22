import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./use-backend";

// NOTE: `initialized` param kept for backwards compatibility but no longer used in queryKey.
// The hook is now self-contained: it calls _initializeAccessControl() then isCallerAdmin()
// as soon as the actor is available, with no external gate.
export function useIsAdmin(_initialized?: boolean) {
  const { actor, isFetching } = useBackend();
  // Use the principal string as part of the query key so the cache is invalidated on login/logout.
  // !!actor is identical (true) for both anonymous and authenticated actors, so using it alone
  // caused a stale cache hit: the cached false from the anonymous check was served after login.
  const { identity } = useInternetIdentity();
  const principalText = identity?.getPrincipal().toText() ?? "anonymous";

  // Anonymous principal constant — do not run admin check for unauthenticated actors
  const isAnonymous = principalText === "2vxsx-fae";

  console.log(
    "[Admin] useIsAdmin called — actor:",
    !!actor,
    "principal:",
    principalText,
    "isFetching:",
    isFetching,
    "isAnonymous:",
    isAnonymous,
  );

  const { data: isAdmin = false, isLoading } = useQuery({
    // Include the principal text so cache busts when identity changes (login / logout)
    queryKey: ["isCallerAdmin", principalText, !!actor],
    queryFn: async () => {
      if (!actor) {
        console.log("[Admin] queryFn: no actor, returning false");
        return false;
      }
      try {
        console.log(
          "[Admin] queryFn: calling _initializeAccessControl() for principal:",
          principalText,
        );
        await actor._initializeAccessControl();
        const result = await actor.isCallerAdmin();
        console.log(
          "[Admin] isCallerAdmin result:",
          result,
          "for principal:",
          principalText,
        );
        return result;
      } catch (error) {
        console.log(
          "[Admin] isCallerAdmin error:",
          error,
          "for principal:",
          principalText,
        );
        return false;
      }
    },
    // Only run when actor is ready AND principal is a real authenticated identity (not anonymous)
    enabled: !!actor && !isAnonymous,
    staleTime: 0,
    retry: 2,
  });

  return { isAdmin, isLoading: isFetching || isLoading };
}

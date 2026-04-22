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
  const principalText = identity?.getPrincipal().toText() ?? "2vxsx-fae";

  // AGENTS.md: isAnonymous must be derived STRICTLY from principalText === '2vxsx-fae'.
  // Old line (commented out — do NOT delete):
  // const isAnonymous = principalText === "2vxsx-fae" || principalText === "anonymous";
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
        // TRACE 1: Check what role the canister sees for this caller BEFORE initialization.
        // This reveals whether the actor is actually authenticated (or still anonymous) at call time.
        try {
          const roleBefore = await actor.getCallerUserRole();
          console.log(
            "[Admin] TRACE pre-init: getCallerUserRole() =",
            JSON.stringify(roleBefore),
            "for principal:",
            principalText,
          );
        } catch (roleErr) {
          console.log(
            "[Admin] TRACE pre-init: getCallerUserRole() threw:",
            roleErr,
            "for principal:",
            principalText,
          );
        }

        // NOTE: useActor from @caffeineai/core-infrastructure already calls
        // _initializeAccessControl() internally when isAuthenticated=true before returning
        // the actor. This second call is therefore redundant, but it's idempotent and
        // harmless — keeping it so we can observe the timing in the trace logs.
        console.log(
          "[Admin] queryFn: calling _initializeAccessControl() for principal:",
          principalText,
          "(note: useActor may have already called this internally)",
        );
        await actor._initializeAccessControl();
        console.log(
          "[Admin] queryFn: _initializeAccessControl() completed for principal:",
          principalText,
        );

        // TRACE 2: Check what role the canister sees AFTER initialization.
        // If _initializeAccessControl() registered this caller as admin, the role should reflect it.
        try {
          const roleAfter = await actor.getCallerUserRole();
          console.log(
            "[Admin] TRACE post-init: getCallerUserRole() =",
            JSON.stringify(roleAfter),
            "for principal:",
            principalText,
          );
        } catch (roleErr) {
          console.log(
            "[Admin] TRACE post-init: getCallerUserRole() threw:",
            roleErr,
            "for principal:",
            principalText,
          );
        }

        const result = await actor.isCallerAdmin();
        // TRACE 3: Log the final admin check result with full context.
        console.log(
          "[Admin] isCallerAdmin result:",
          result,
          "for principal:",
          principalText,
          "| actor truthy:",
          !!actor,
          "| isAnonymous:",
          isAnonymous,
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

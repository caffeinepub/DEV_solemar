import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./use-backend";

// NOTE: `initialized` param kept for backwards compatibility but no longer used in queryKey.
// The hook is now self-contained: it calls _initializeAccessControl() then isCallerAdmin()
// as soon as the actor is available, with no external gate.
export function useIsAdmin(_initialized?: boolean) {
  const { actor, isFetching } = useBackend();

  const { data: isAdmin = false, isLoading } = useQuery({
    // queryKey no longer includes `initialized` — avoids stale cache mismatch
    queryKey: ["isCallerAdmin", !!actor],
    queryFn: async () => {
      if (!actor) return false;
      try {
        await actor._initializeAccessControl();
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    // Enabled as soon as the actor is ready — isFetching gate removed to avoid query never running
    enabled: !!actor,
    staleTime: 0,
    retry: 2,
  });

  return { isAdmin, isLoading: isFetching || isLoading };
}

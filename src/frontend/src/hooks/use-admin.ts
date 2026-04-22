import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./use-backend";

export function useIsAdmin(initialized = false) {
  const { actor, isFetching } = useBackend();

  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        await actor._initializeAccessControl();
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching && initialized,
    staleTime: 0,
    retry: 2,
  });

  return { isAdmin, isLoading: isFetching || isLoading };
}

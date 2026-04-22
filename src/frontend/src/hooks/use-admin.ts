import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./use-backend";

export function useIsAdmin() {
  const { actor, isFetching } = useBackend();

  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      await actor._initializeAccessControl();
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  return { isAdmin, isLoading: isFetching || isLoading };
}

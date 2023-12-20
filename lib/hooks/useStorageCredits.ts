import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc/api";

export default function useStorageCredits() {
  const { data: session } = useSession();

  const {
    data: remainingCredits,
    isLoading,
    isError,
    refetch,
  } = api.storage.credits.useQuery(undefined, {
    enabled: !!session?.user,
  });

  return {
    remainingCredits,
    isLoading,
    refetch,
  };
}

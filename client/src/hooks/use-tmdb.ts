import useSWR from "swr";

export function useTMDB(endpoint: string | null) {
  const { data, error } = useSWR(
    endpoint ? `/api/tmdb/${endpoint}` : null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  return {
    data,
    isLoading: !error && !data && endpoint !== null,
    error,
  };
}

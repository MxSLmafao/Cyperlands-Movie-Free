import useSWR from "swr";

export function useTMDB(endpoint: string) {
  const { data, error } = useSWR(`/api/tmdb/${endpoint}`);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
}

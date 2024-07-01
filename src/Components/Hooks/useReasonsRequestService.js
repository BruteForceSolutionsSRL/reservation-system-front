import { useFetchService } from "./useFetchService";

export function useReasonsRequestService() {
  const { getFetch } = useFetchService();

  const getReasons = async (abortController) => {
    return getFetch("reservations/reasons", abortController);
  };

  return { getReasons };
}

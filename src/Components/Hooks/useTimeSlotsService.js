import { useFetchService } from "./useFetchService";

export function useTimeSlotsService() {
  const { getFetch } = useFetchService();

  const getTimeSlots = async (abortController) => {
    return getFetch("timeslots", abortController);
  };

  return { getTimeSlots };
}

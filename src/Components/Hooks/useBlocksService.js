import { useFetchService } from "./useFetchService";

export function useBlockService() {
  const { getFetch } = useFetchService();

  const getBlocks = async (abortController) => {
    return getFetch("blocks", abortController);
  };
  return { getBlocks };
}

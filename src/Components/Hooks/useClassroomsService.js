import { useFetchService } from "./useFetchService";

export function useClassroomsService() {
  const { getFetch } = useFetchService();

  const getClassrooms = async (abortController) => {
    return getFetch("classrooms", abortController);
  };
  const getClassroomsByBlockId = async (id, abortController) => {
    return getFetch(`classrooms/block/${id}`, abortController);
  };

  return { getClassrooms, getClassroomsByBlockId };
}

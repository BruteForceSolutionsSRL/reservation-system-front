export function searchByClassroomsForStatistics(list, searchValue) {
  return list.filter(
    (each) =>
      each.classroom_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.block_name.toLowerCase().includes(searchValue.toLowerCase())
  );
}

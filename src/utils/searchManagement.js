export function searchManagement(list, searchValue) {
  return list.filter(
    (each) =>
      each.status_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.gestion_name.toLowerCase().includes(searchValue.toLowerCase())
  );
}
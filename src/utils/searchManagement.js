export function searchManagement(list, searchValue) {
  return list.filter(
    (each) =>
      each.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.initial_date.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.end_date.toLowerCase().includes(searchValue.toLowerCase()) 
  );
}

export function searchPeriod(list, searchValue) {
  return list.filter(
    (each) =>
      each.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.initial_date.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.end_date.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.faculty_name.toLowerCase().includes(searchValue.toLowerCase())||
      each.academic_management_name.toLowerCase().includes(searchValue.toLowerCase())
    
  );
}
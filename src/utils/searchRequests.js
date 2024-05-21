export function searchRequests(list, searchValue) {
  return list.filter(
    (each) =>
      each.subject_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.block_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.reservation_status
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      each.reason_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.groups.some((group) =>
        group.teacher_name.toLowerCase().includes(searchValue.toLowerCase())
      ) ||
      each.classrooms.some((classroom) =>
        classroom.classroom_name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
  );
}

export function searchEnvironments(list, searchValue) {
  return list.filter(
    (each) =>
      each.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.block_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.status_name.toLowerCase().includes(searchValue.toLowerCase())
  );
}

export function searchEnvironmentsForEdit(list, searchValue) {
  return list.filter(
    (each) =>
      each.classroom_name.toLowerCase().includes(searchValue.toLowerCase())
  );
}

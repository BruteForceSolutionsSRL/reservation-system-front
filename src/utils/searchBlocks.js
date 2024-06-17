export function searchBlocks(list, searchValue) {
  return list.filter(
    (each) =>
      each.block_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      each.block_status_name.toLowerCase().includes(searchValue.toLowerCase())
  );
}

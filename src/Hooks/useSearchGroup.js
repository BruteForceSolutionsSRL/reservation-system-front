import { useEffect, useState } from "react";

export function useSearchGroup({ groupsList, searchValue }) {
  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    let newList = search();
    setResultList(newList);
  }, [searchValue]);

  const search = () => {
    if (searchValue === "") {
      return groupsList;
    } else {
      return groupsList.filter(
        (g) =>
          (g.group_id + "").toLowerCase().includes(searchValue.toLowerCase()) ||
          g.subject_name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  };

  return { resultList };
}

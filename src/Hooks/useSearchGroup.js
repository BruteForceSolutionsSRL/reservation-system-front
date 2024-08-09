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
          g.subject_name.toLowerCase().includes(searchValue.toLowerCase()) ||
          g.person.fullname.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  };

  return { resultList };
}

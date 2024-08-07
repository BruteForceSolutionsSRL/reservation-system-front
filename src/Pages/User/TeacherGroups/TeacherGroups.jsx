import { useEffect, useState } from "react";
import { useFetchService } from "../../../Components/Hooks/useFetchService";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import { ElementGroup } from "./ElementGroup";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

export default function TeacherGroups() {
  const { getFetch } = useFetchService();
  const [searchValue, setSearchValue] = useState("");
  const [groupsList, setGroupsList] = useState([]);
  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupsTeacher().finally(() => setLoading(false));
  }, []);

  const fetchGroupsTeacher = async () => {
    const { status, data } = await getFetch("teacher-subjects/teacher");
    console.log(status, data);
    if (status >= 200 && status < 300) {
      setGroupsList(data);
      setResultList(data);
    } else {
      setGroupsList([]);
    }
  };
  return (
    <>
      <div className="mx-2 p-3 shadow rounded position-sticky top-0 bg-white">
        <h1 className="text-center">Lista de grupos</h1>
        <div className="d-flex">
          <div className="align-self-center flex-fill">
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPaste={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
      <div className="px-2">
        {loading ? (
          <div
            className="d-flex aling-items-center justify-content-center"
            style={{ height: "30rem" }}
          >
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {groupsList.length < 1 ? (
              <div
                className="d-flex aling-items-center justify-content-center"
                style={{ height: "30rem" }}
              >
                <h3>No existen grupos por el momento.</h3>
              </div>
            ) : (
              <>
                {resultList.length < 1 ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "25rem" }}
                  >
                    <h3 className="text-center">
                      No se encontraron resultados.
                    </h3>
                  </div>
                ) : (
                  <>
                    {resultList.map((g) => {
                      return <ElementGroup {...g} />;
                    })}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

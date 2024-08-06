import { useState } from "react";
import { useFetchService } from "../../../Components/Hooks/useFetchService";
import { useSearchGroup } from "../../../Hooks/useSearchGroup";
import { listGroups } from "../../SuperUser/Groups/groupsmocks";
import GroupsList from "../../../Components/Groups/GroupsList/GroupsList";
import SearchBar from "../../../Components/SearchBar/SearchBar";

export default function TeacherGroups() {
  const groupsList = listGroups;
  const { getFetch } = useFetchService();
  const [searchValue, setSearchValue] = useState("");
  const { resultList } = useSearchGroup({ groupsList, searchValue });
  //   Los datos tan hardoceados :c falta conectar :'c
  //   endpoint: teacher-subjects/teacher para obtener grupos
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
        {groupsList.length < 1 ? (
          <div>
            <h1>No existen grupos por el momento.</h1>
          </div>
        ) : (
          <>
            {resultList.length < 1 ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "25rem" }}
              >
                <h3 className="text-center">No se encontraron resultados.</h3>
              </div>
            ) : (
              <GroupsList groupsList={resultList} />
            )}
          </>
        )}
      </div>
    </>
  );
}

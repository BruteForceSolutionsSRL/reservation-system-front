import { useState } from "react";
import GroupsList from "../../../../Components/Groups/GroupsList/GroupsList";
import { listGroups } from "../groupsmocks";
import { useSearchGroup } from "../../../../Hooks/useSearchGroup";
import SearchBar from "../../../../Components/SearchBar/SearchBar";

export default function HistoryGroups() {
  const groupsList = listGroups;
  const [searchValue, setSearchValue] = useState("");
  const { resultList } = useSearchGroup({ groupsList, searchValue });

  return (
    <>
      <div className="mx-2 p-3 shadow rounded position-sticky top-0 bg-white">
        <h1 className="text-center">Historial de grupos</h1>
        <SearchBar
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPaste={(e) => e.preventDefault()}
        />
      </div>
      {groupsList.length < 1 ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "25rem" }}
        >
          <div className="text-center">
            <i className="bi bi-collection fs-1 d-block"></i>
            <span className="fs-4">
              No se encontraron grupos registrados por ahora.
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="px-2">
            {resultList.length < 1 ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "25rem" }}
              >
                <div className="text-center">
                  <i className="bi bi-patch-question fs-1 d-block"></i>
                  <span className="fs-4">No se encontraron resultados</span>
                </div>
              </div>
            ) : (
              <GroupsList groupsList={resultList} />
            )}
          </div>
        </>
      )}
    </>
  );
}

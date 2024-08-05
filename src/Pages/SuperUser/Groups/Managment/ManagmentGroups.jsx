import { useState } from "react";
import GroupsList from "../../../../Components/Groups/GroupsList/GroupsList";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import { useSearchGroup } from "../../../../Hooks/useSearchGroup";
import { listGroups } from "../groupsmocks";
import NewGroup from "../../../../Components/Groups/NewGroup";

export default function ManagmentGroups() {
  const groupsList = listGroups;
  const [searchValue, setSearchValue] = useState("");
  const { resultList } = useSearchGroup({ groupsList, searchValue });
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

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
          <div className="align-self-center d-flex justify-content-end">
            <button className="btn" onClick={() => setShowNewGroupModal(true)}>
              <i className="bi bi-plus-circle fs-3 d-block"></i>
              <span>Nuevo</span>
            </button>
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
      <NewGroup
        show={showNewGroupModal}
        setShow={(value) => setShowNewGroupModal(value)}
      />
    </>
  );
}

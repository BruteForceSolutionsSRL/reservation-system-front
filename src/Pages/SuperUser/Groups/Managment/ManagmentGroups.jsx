import { useEffect, useState } from "react";
import GroupsList from "../../../../Components/Groups/GroupsList/GroupsList";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import NewGroup from "../../../../Components/Groups/NewGroup";
import { useFetchService } from "../../../../Components/Hooks/useFetchService";
import LoadingSpinner from "../../../../Components/LoadingSpinner/LoadingSpinner";

export default function ManagmentGroups() {
  const { getFetch } = useFetchService();
  const [groupsList, setGroupsList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups().finally(() => setLoading(false));
  }, []);

  const search = (value) => {
    let newList = [];
    if (value === "") {
      return groupsList;
    } else {
      newList = groupsList.filter(
        (g) =>
          g.subject_name.toLowerCase().includes(value.toLowerCase()) ||
          g.person.fullname.toLowerCase().includes(value.toLowerCase())
      );
    }
    return newList;
  };

  const handleChangeSearchValue = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    const newList = search(value);
    setResultList(newList);
  };

  const fetchGroups = async () => {
    const { status, data } = await getFetch(`teacher-subjects/${1}`);
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
            <SearchBar value={searchValue} onChange={handleChangeSearchValue} />
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
                  <GroupsList groupsList={resultList} />
                )}
              </>
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

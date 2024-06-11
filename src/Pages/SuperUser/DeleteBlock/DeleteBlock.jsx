import { useEffect, useState } from "react";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import BlockDelete from "./BlockDelete";
import { getClassroomsForDeleteList } from "../../../services/classrooms";
import { searchEnvironments } from "../../../utils/searchRequests";
import { Spinner } from "react-bootstrap";

function DeleteBlock() {
  const [allEnvironments, setAllEnvironments] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadList, setReloadList] = useState(false);

  const blocks = [
    {
      id: 1,
      name: "AULAS INF-LAB",
      capacity_class: 6,
      floor: 0,
      status_name: "HABILITADO",
      statistics: {
        accepted_reservations: 1,
        rejected_reservations: 0,
        pending_reservations: 0,
        total_reservations: 1,
      },
    },
    {
      id: 2,
      name: "EDIFICIO MEMI",
      capacity_class: 6,
      floor: 3,
      status_name: "HABILITADO",
      statistics: {
        accepted_reservations: 1,
        rejected_reservations: 0,
        pending_reservations: 0,
        total_reservations: 1,
      },
    },
    {
      id: 3,
      name: "EDIFICIO ACADEMICO 2",
      capacity_class: 20,
      floor: 3,
      status_name: "DESABILITADO",
      statistics: {
        accepted_reservations: 1,
        rejected_reservations: 0,
        pending_reservations: 0,
        total_reservations: 1,
      },
    },
    {
      id: 4,
      name: "BLOQUE TRENCITO",
      capacity_class: 6,
      floor: 3,
      status_name: "HABILITADO",
      statistics: {
        accepted_reservations: 1,
        rejected_reservations: 0,
        pending_reservations: 0,
        total_reservations: 1,
      },
    },
    {
      id: 5,
      name: "BLOQUE CENTRAL - EDIFICIO DECANATURA",
      capacity_class: 6,
      floor: 3,
      status_name: "HABILITADO",
      statistics: {
        accepted_reservations: 1,
        rejected_reservations: 0,
        pending_reservations: 0,
        total_reservations: 1,
      },
    },
  ];

  useEffect(() => {
    setReloadList(false);
    setLoading(true);
    getEnvironmentsList();
    //getEnvironmentsList();
  }, [reloadList]);

  useEffect(() => {
    if (searchValue === "") {
      setEnvironments(allEnvironments);
      setMsgNoResults("");
    } else {
      const results = searchEnvironments(allEnvironments, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados para la busqueda.");
      } else {
        setMsgNoResults("");
      }
      setEnvironments(results);
    }
  }, [searchValue]);

  /*const getEnvironmentsList = async () => {
    let envl = await getClassroomsForDeleteList()
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => console.error(err));
    setAllEnvironments(envl);
    setEnvironments(envl);
  };*/

  function getEnvironmentsList() {
    setAllEnvironments(blocks);
    setEnvironments(blocks);
    setLoading(false);
  }

  return (
    <div className="container">
      <h1 className="text-center">Eliminar Bloque</h1>
      <SearchBar
        value={searchValue}
        onChange={(event) => {
          const regex = /^[a-zA-Z0-9\s]*$/;
          if (regex.test(event.target.value) || event.target.value === "") {
            setSearchValue(event.target.value);
          }
        }}
      />
      <hr />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {environments.length > 0 ? (
            <>
              {environments.map((each) => {
                return (
                  <div key={each.id}>
                    <BlockDelete
                      {...each}
                      reloadList={(change) => setReloadList(change)}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <h3 className="text-center">{msgNoResults}</h3>
            </>
          )}
        </>
      )}
    </div>
  );
}
export default DeleteBlock;

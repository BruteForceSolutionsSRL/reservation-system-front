import { useEffect, useState } from "react";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import EnvironmentToDelete from "./EnvironmentToDelete";
import { getClassroomsForDeleteList } from "../../../services/classrooms";
import { searchEnvironments } from "../../../utils/searchRequests";
import { Spinner } from "react-bootstrap";

export default function DeleteEnvironment() {
  const [allEnvironments, setAllEnvironments] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadList, setReloadList] = useState(false);

  useEffect(() => {
    setReloadList(false);
    setLoading(true);
    getEnvironmentsList();
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

  const getEnvironmentsList = async () => {
    let envl = await getClassroomsForDeleteList()
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => console.error(err));
    setAllEnvironments(envl);
    setEnvironments(envl);
  };

  return (
    <div className="container mt-2">
      <h1 className="text-center">Lista de Ambientes</h1>
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
                    <EnvironmentToDelete
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

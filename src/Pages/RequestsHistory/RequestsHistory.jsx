import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import RequestInformation from "../../Components/RequestInformation/RequestInformation";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { getRequests, getTeacherRequests } from "../../services/requests";
import { searchRequests } from "../../utils/searchRequests";

export default function RequestsHistory() {
  const [loading, setLoading] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");

  // getReservations
  useEffect(() => {
    setLoading(true);
    Promise.all([getRequests(), getTeacherRequests({ id: 2 })])
      .then(([requests, teacherRequests]) => {
        setAllReservations(requests);
        setList(requests);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Useeffect for search
  useEffect(() => {
    if (searchValue === "") {
      setList(allReservations);
      setMsgNoResults("");
    } else {
      const results = searchRequests(allReservations, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados");
      } else {
        setMsgNoResults("");
      }
      setList(results);
    }
  }, [searchValue]);

  return (
    <div className="container">
      <h1 className="text-center">Historial de solicitudes</h1>

      <SearchBar
        value={searchValue}
        onChange={(event) => {
          const regex = /^[a-zA-Z0-9\s]*$/;
          if (regex.test(event.target.value) || event.target.value === "") {
            setSearchValue(event.target.value);
          }
        }}
      />
      <div className="container">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            <div className="row text-center" style={{ minWidth: "350px" }}>
              <div className="col-1 mt-1 mb-1">
                <i>ID</i>
              </div>
              <div className="col-3 mt-1 mb-1">
                <i>Materia(s)</i>
              </div>
              <div className="col-2 mt-1 mb-1">
                <i>Cantidad de estudiantes</i>
              </div>
              <div className="col-2 mt-1 mb-1">
                <i>Fecha de reserva</i>
              </div>
              <div className="col-2 mt-1 mb-1">
                <i>Periodos</i>
              </div>
              <div className="col-2 mt-1 mb-1"></div>
            </div>
            <hr />
            {list.length > 0 ? (
              list.map((each) => {
                let content = {
                  id: each.reservation_id,
                  subject: each.subject_name,
                  groups: each.groups,
                  reservation_date: each.reservation_date,
                  periods: each.time_slot,
                  quantity_studets: each.quantity,
                  block: each.block_name,
                  classrooms: each.classrooms,
                  reason: each.reason_name,
                  state: each.reservation_status,
                };
                return (
                  <div key={each.reservation_id}>
                    <RequestInformation content={content} />
                  </div>
                );
              })
            ) : (
              <h3 className="text-center">{msgNoResults}</h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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

  useEffect(() => {
    setLoading(true);
    teacherHistory();
  }, []);

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

  const teacherHistory = async () => {
    const th = await getTeacherRequests()
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    th.length === 0 &&
      setMsgNoResults(
        "No cuenta con un historial de solicitudes por el momento."
      );
    setAllReservations(th);
    setList(th);
  };

  return (
    <div className="container mt-2">
      <h1 className="text-center">Historial de solicitudes</h1>

      <div className="pb-3">
        <SearchBar
          value={searchValue}
          onChange={(event) => {
            const regex = /^[a-zA-Z0-9\s]*$/;
            if (regex.test(event.target.value) || event.target.value === "") {
              setSearchValue(event.target.value);
            }
          }}
        />
      </div>
      <div className="container">
        {loading ? (
          <div className="h-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            <hr />
            {list.length > 0 ? (
              list.map((each, index) => {
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
                    <RequestInformation
                      content={content}
                      index={index + 1}
                      title={"SOLICITUD DE RESERVA"}
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-center">
                <div>
                  <i className="bi bi-question-circle fs-1 pe-2"></i>
                </div>
                <div>
                  <h3>{msgNoResults}</h3>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

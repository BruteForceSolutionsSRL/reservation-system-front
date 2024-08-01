import { useState, useEffect } from "react";
import RequestInformation from "../../Components/RequestInformation/RequestInformation";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { getTeacherRequests } from "../../services/requests";
import { searchRequests } from "../../utils/searchRequests";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

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

  const searchRqst = (value) => {
    if (value === "") {
      setList(allReservations);
      setMsgNoResults("");
    } else {
      const results = searchRequests(allReservations, value);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados");
      } else {
        setMsgNoResults("");
      }
      setList(results);
    }
  };

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
    <>
      <div
        className="position-sticky top-0 bg-white p-2 rounded-bottom"
        style={{ boxShadow: "0px 1px 6px #0000006e" }}
      >
        <h1 className="text-center">Historial de solicitudes</h1>
        <div className="pb-3">
          <SearchBar
            value={searchValue}
            onChange={(event) => {
              let { value } = event.target;
              setSearchValue(value);
              searchRqst(value);
            }}
          />
        </div>
      </div>
      <div className="container mt-2">
        <div className="p-2">
          {loading ? (
            <div style={{ height: "50rem" }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div>
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
    </>
  );
}

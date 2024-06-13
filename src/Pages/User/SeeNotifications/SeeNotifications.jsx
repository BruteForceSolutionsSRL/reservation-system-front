import { useEffect, useState } from "react";
import { getUserNotifications } from "../../../services/notifications";
import { NotificationElement } from "./NotificationElement";
import { Spinner } from "react-bootstrap";

export default function SeeNotifications() {
  const [notificationsList, setNotificationsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("userInformation"));

  useEffect(() => {
    getNotifications().finally(() => {
      setLoading(false);
    });
  }, []);

  const getNotifications = async () => {
    let response = await getUserNotifications(user.teacher_id).finally(() =>
      setLoading(false)
    );
    if (response.status >= 200 && response.status < 300) {
      if (response.data.length === 0) {
        setErrorMessage("No tienes notificaciones por el momento.");
        setNotificationsList(response.data);
      } else {
        orderPerPage(response.data.reverse());
        setNotificationsList(response.data.reverse());
      }
    } else if (response.status >= 300 && response.status < 400) {
      setErrorMessage(response.data.message);
      setNotificationsList([]);
    } else if (response.status >= 400 && response.status < 500) {
      setErrorMessage(response.data.message);
      setNotificationsList([]);
    } else if (response.status >= 500) {
      setErrorMessage(response.data.message);
      setNotificationsList([]);
    }
  };

  const orderPerPage = (list) => {
    let paginatedArray = [];
    for (let i = 0; i < list.length; i += 15) {
      let page = list.slice(i, i + 15);
      paginatedArray.push(page);
    }
    setPagination(paginatedArray);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container" style={{ height: "90vh" }}>
      <h1 className="text-center">Notificaciones</h1>
      {loading ? (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div>
            <span className="fs-3 pe-2">Cargando</span>
          </div>
          <div>
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      ) : (
        <>
          {notificationsList.length === 0 ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ maxHeight: "75vh" }}
            >
              <h4>{errorMessage}</h4>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-end">
                <i
                  className="bi bi-arrow-clockwise fs-1 pe-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setLoading(true);
                    getNotifications();
                  }}
                ></i>
                <div className="d-flex justify-content-end">
                  <div className="align-self-center">
                    <i className="p-4 text-center align-self-center">
                      {currentPage + 1} de {pagination.length}
                    </i>
                  </div>
                  <div>
                    <i
                      className="bi bi-arrow-left fs-1 pe-2"
                      style={{ cursor: "pointer" }}
                      onClick={handlePrevPage}
                    ></i>
                    <i
                      className="bi bi-arrow-right fs-1"
                      style={{ cursor: "pointer" }}
                      onClick={handleNextPage}
                    ></i>
                  </div>
                </div>
              </div>
              <div
                className="w-100 overflow-x-auto overflow-y-auto"
                style={{ maxHeight: "75vh" }}
              >
                {pagination[currentPage] &&
                  pagination[currentPage].map((notification, index) => (
                    <div key={index}>
                      <NotificationElement {...notification} />
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

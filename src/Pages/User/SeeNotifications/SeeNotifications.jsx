import { useEffect } from "react";
import { getUserNotifications } from "../../../services/notifications";
import { NotificationElement } from "./NotificationElement";
import { useState } from "react";
import { Spinner } from "react-bootstrap";

export default function SeeNotifications() {
  const [notificationsList, setNotificationsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("userInformation"));

  useEffect(() => {
    getNotifications().finally(() => {
      setLoading(false);
    });
  }, []);

  const getNotifications = async () => {
    let response = await getUserNotifications(user.teacher_id);
    if (response.status >= 200 && response.status < 300) {
      if (response.data.length === 0) {
        setErrorMessage("No tienes notificaciones por el momento.");
        setNotificationsList(response.data);
      } else {
        orderPerPage(response.data);
        setNotificationsList(response.data);
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
                ></i>
                <div className="d-flex justify-content-end">
                  <div className="align-self-center">
                    <i className="p-4 text-center align-self-center">
                      {pagination.length} de {notificationsList.length}
                    </i>
                  </div>
                  <div>
                    <i
                      className="bi bi-arrow-left fs-1 pe-2"
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="bi bi-arrow-right fs-1"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
              </div>
              <div
                className="w-100 overflow-x-auto overflow-y-auto"
                style={{ maxHeight: "75vh" }}
              >
                {notificationsList.map((notification, index) => {
                  return (
                    <div key={index + notification.id}>
                      <NotificationElement {...notification} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

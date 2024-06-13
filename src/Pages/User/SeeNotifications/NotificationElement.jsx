import { useEffect, useState } from "react";
import "./NotificationElement.css";

export function NotificationElement(props) {
  const { body, id, reservation_id, sendBy, title, to, type } = props;
  const [notificationReaded, setNotificationReaded] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("userInformation"));

  useEffect(() => {
    isNotificationReaded();
  }, []);

  const isNotificationReaded = () => {
    let person = to.find((person) => person.person_id === user.teacher_id);
    if (person) {
      if (person.readed === 1) {
        setNotificationReaded(true);
      } else {
        setNotificationReaded(false);
      }
    }
  };

  const singleNotification = () => {
    window.location.href = `notifications/${id}`;
  };

  return (
    <div
      className={` hover border rounded m-2 p-1 d-flex justify-content-between align-items-center  ${
        notificationReaded ? "border-dark" : " bg-info-subtle border-secondary"
      }`}
      style={{ minWidth: "300px", cursor: "pointer" }}
      onClick={singleNotification}
    >
      <div className="ps-2 pe-2">
        {type === "ACEPTADA" ? (
          <i className="bi bi-check-circle-fill fs-1 text-success"></i>
        ) : type === "INFORMATIVO" ? (
          <i className="bi bi-exclamation-circle-fill fs-1 text-primary"></i>
        ) : type === "RECHAZADA" ? (
          <i className="bi bi-x-circle-fill fs-1 text-danger"></i>
        ) : type === "CANCELADA" ? (
          <i className="bi bi-x-octagon-fill fs-1 text-secondary"></i>
        ) : type === "ADVERTENCIA" ? (
          <i className="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
        ) : (
          <i className="bi bi-circle-fill fs-1 text-primary"></i>
        )}
      </div>
      <div className="text-truncate w-100" style={{ maxWidth: "250px" }}>
        <b>Enviado por: </b>
        <div className="text-truncate" style={{ maxWidth: "250px" }}>
          <span>{sendBy}</span>
        </div>
      </div>
      <div className="text-truncate w-100" style={{ maxWidth: "350px" }}>
        <div>
          <b>{title}</b>
        </div>
        <div>
          <span>{body}</span>
        </div>
      </div>
      <div
        className="d-flex justify-content-between text-truncate"
        style={{ maxWidth: "250px" }}
      >
        <div className="pe-3 w-100">
          <b>12:30</b>
        </div>
        <div className="pe-3 w-100">
          <i
            className={`bi bi-circle${
              notificationReaded ? "" : "-fill"
            } text-primary`}
          ></i>
        </div>
      </div>
    </div>
  );
}

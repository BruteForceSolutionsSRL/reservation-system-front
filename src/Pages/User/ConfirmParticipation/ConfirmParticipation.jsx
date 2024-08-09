import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

export default function ConfirmParticipation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({});
  const [loadingResponse, setLoadingResponse] = useState(false);
  const API = import.meta.env.VITE_REACT_API_URL;

  const fetchData = async () => {
    setLoadingResponse(true);
    const response = await fetch(API + "reservations/confirm/participation", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
    });
    const data = await response.json();
    const { status } = response;
    if (status >= 200 && status < 300) {
      const newMessage = {
        title: "Aceptado",
        body: data.message,
      };
      setMessage(newMessage);
      const timeToCloseWindow = 5000;
      setInterval(() => {
        window.close();
      }, timeToCloseWindow);
    } else {
      const newMessage = {
        title: "Error",
        body:
          data.message ?? "Ocurrio un error inesperado, intentelo nuevamente",
      };
      setMessage(newMessage);
    }
  };

  const handleSendConfirm = async () => {
    await fetchData().finally(() => setLoadingResponse(false));
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="shadow p-3">
          <div className="p-2">
            <p>¿Está seguro de participar en la solicitud de reserva?</p>
            <div className="d-flex justify-content-center align-items-center">
              <button
                className="btn btn-primary w-100"
                onClick={handleSendConfirm}
                disabled={loadingResponse}
              >
                Aceptar
              </button>
            </div>
          </div>
          <div className="my-2">
            {message.body && (
              <Alert
                variant={message.title === "Aceptado" ? "success" : "danger"}
              >
                {message.body}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

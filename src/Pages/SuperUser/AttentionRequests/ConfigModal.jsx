import { useEffect, useState } from "react";
import { useFetchService } from "../../../Components/Hooks/useFetchService";
import { Modal } from "react-bootstrap";

export default function ConfigModal({ showConfig, setShowConfig }) {
  const { getFetch, postFetch } = useFetchService();
  const [labelAttentionManualOrAutomatic, setLabelAttentionManualOrAutomatic] =
    useState("1");
  const [maximalReservationPerGroup, setMaximalReservationPerGroup] =
    useState("2");
  const [
    loadingRequestChangeManualOrAutomatic,
    setLoadingRequestChangeManualOrAutomatic,
  ] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchStateManualOrAutoAttention(),
      fetchStateMaximalReservationPerGroup(),
    ]);
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    const filteredValue = value.replace(/[^0-9]/g, "");
    setMaximalReservationPerGroup(filteredValue);
    changeMaximalReservationsPerGroup(filteredValue);
  };

  const fetchStateManualOrAutoAttention = async () => {
    const { status, data } = await getFetch("constants/automatic-reservation");
    if (status >= 200 && status < 300) {
      setLabelAttentionManualOrAutomatic(data.status + "");
    }
  };

  const fetchStateMaximalReservationPerGroup = async () => {
    const { status, data } = await getFetch(
      "constants/maximal-reservations-per-group"
    );
    if (status >= 200 && status < 300) {
      setMaximalReservationPerGroup(data.status);
    }
  };

  const changeMaximalReservationsPerGroup = async (newMaximal) => {
    const { status, data } = await postFetch(
      "constants/maximal-reservations-per-group",
      { quantity: newMaximal }
    );
    if (status >= 200 && status < 300) {
      setMaximalReservationPerGroup(data.status);
    } else {
      setMaximalReservationPerGroup(newMaximal);
    }
  };

  const handleChangeState = () => {
    changeStateManualOrAutomatic().finally(() =>
      setLoadingRequestChangeManualOrAutomatic(false)
    );
  };

  const changeStateManualOrAutomatic = async () => {
    setLoadingRequestChangeManualOrAutomatic(true);
    const { status, data } = await postFetch(
      "constants/automatic-reservation",
      {}
    );
    if (status >= 200 && status < 300) {
      setLabelAttentionManualOrAutomatic(data.status);
    }
  };

  return (
    <>
      <Modal show={showConfig} onHide={() => setShowConfig(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajustes de solicitudes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pb-2">
            <i className="fs-6">
              NOTA: Para cambiar el tipo de atencion de solicitudes, presione
              sobre
              <strong>
                {labelAttentionManualOrAutomatic === "1"
                  ? " AUTOMATICO "
                  : " MANUAL "}
              </strong>
              para cambiar entre <strong>Manual</strong> o
              <strong> Automatico</strong>
            </i>
          </div>
          <div className="d-flex align-items-center">
            <strong className="me-2">Atencion de solicitudes: </strong>
            <button
              onClick={handleChangeState}
              className={`btn btn-${
                labelAttentionManualOrAutomatic === "1"
                  ? "success"
                  : "secondary"
              }`}
              disabled={loadingRequestChangeManualOrAutomatic}
            >
              {labelAttentionManualOrAutomatic === "1"
                ? "AUTOMATICO"
                : "MANUAL"}
            </button>
          </div>
          <div className="py-2 d-flex align-items-center">
            <strong className="me-2">Reservas maxima por grupo:</strong>
            <div>
              <input
                type="text"
                className="form-control"
                value={maximalReservationPerGroup}
                onChange={handleChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowConfig(false)}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

import { Button } from "react-bootstrap";
import "./EditManagement.css";

const ListManagement = ({ list, handleShowModal }) => {
  return (
    <div>
      {list.map((management, index) => (
        <div key={index} style={{ minWidth: "300px" }}>
          <div
            className="row border border-black rounded p-2 mb-2"
            style={{ minWidth: "400px" }}
          >
            <div className="col-sm-6">
              <div>
                <b className="col text-primary">ESTADO: </b>
                <b
                  className={`text-light rounded p-1 ${
                    parseInt(management.status_id) === 1
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {management.status_name}
                </b>
              </div>
              <div>
                <b className="text-primary">PERIODO DE DURACIÓN: </b>
                <b>{management.period_duration}</b>
              </div>
            </div>
            <div className="col-sm-4">
              <div>
                <b className="text-primary">GESTIÓN: </b>
                <b>{management.gestion_name}</b>
              </div>
            </div>
            <div className="col-sm-2 align-self-center d-flex justify-content-end">
              <Button
                variant="primary"
                className="mt-1 custom-button btn btn-primary custom-btn-primary-outline"
                onClick={() => handleShowModal(management)}
              >
                Editar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListManagement;

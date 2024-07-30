import { Modal } from "react-bootstrap";

export default function NewGroup({ show, setShow }) {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear nuevo grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex">
              <b>MATERIA: </b>
              <select className="form-select ms-2"></select>
            </div>
            <div className="d-flex">
              <b>DOCENTE: </b>
              <select className="form-select ms-2"></select>
            </div>
            m
            <div className="d-flex">
              <b># DE GRUPO: </b>
              <select className="form-select ms-2"></select>
            </div>
            <div className="d-flex">
              <b>GESTIÓN: </b>
              <select className="form-select ms-2"></select>
            </div>
            <div className="d-flex">
              <b>CARRERAS ASIGNADAS: </b>
              <select className="form-select ms-2"></select>
            </div>
            <div className="">
              <b>HORARIO DE CLASES: </b>
              <div className="border rounded">
                <div className="row">
                  <div className="col-md-2 text-center">
                    <b>Dia</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="monday"
                      />
                      <label class="form-check-label" for="monday">
                        Lunes
                      </label>
                    </div>

                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="tuesday"
                      />
                      <label class="form-check-label" for="tuesday">
                        Martes
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="wednesday"
                      />
                      <label class="form-check-label" for="wednesday">
                        Miércoles
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="thursday"
                      />
                      <label class="form-check-label" for="thursday">
                        Jueves
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="friday"
                      />
                      <label class="form-check-label" for="friday">
                        Viernes
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="saturday"
                      />
                      <label class="form-check-label" for="saturday">
                        Sábado
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleClose}>
            Crear
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

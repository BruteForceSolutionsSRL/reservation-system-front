import { Modal, Table } from "react-bootstrap";

export default function ModalRequestInformation({
  show,
  setShow,
  request = {},
  title,
  footerContent = null,
}) {
  const {
    subject,
    persons,
    reservation_date,
    periods,
    quantity_studets,
    blocks,
    classrooms,
    reason,
    state,
  } = request;

  return (
    <Modal show={show} onHide={() => setShow(false)} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="">
          <div className="pb-3">
            <b>MATERIA: </b> {subject ?? "Sin materia"}
          </div>

          <div className="pb-3">
            <b>ESTADO: </b>
            <b
              className={`rounded p-1 text-white bg-${
                state === "ACEPTADO"
                  ? "success"
                  : state === "CANCELADO"
                  ? "secondary"
                  : state === "RECHAZADO"
                  ? "danger"
                  : "dark text-white"
              }`}
            >
              {state ?? "Sin estado"}
            </b>
          </div>

          <div className="tag-container mb-3">
            <label className="tag-label">GRUPO</label>
            <div
              className="scrol-teacher-modal h-100 overflow-y-auto"
              style={{ maxHeight: "200px" }}
            >
              <Table bordered className="w-100">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Grupo</th>
                  </tr>
                </thead>
                <tbody>
                  {persons.map((each) => {
                    const { groups } = each;
                    return (
                      <tr key={groups[0].group_id + each.person_id}>
                        <td>{each.name + " " + each.last_name}</td>
                        <td>
                          {groups.length < 2
                            ? groups.map((g) => g.group_number)
                            : groups.map((g) => g.group_number + ", ")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="pb-3">
            <b>FECHA DE RESERVA: </b> {reservation_date ?? "Sin fecha"}
          </div>
          <div className="pb-3">
            <b>PERIODOS: </b> {periods[0] ?? "Sin horario"}-{periods[1] ?? ""}
          </div>
          <div className="pb-3">
            <b>CANTIDAD DE ESTUDIANTES: </b>
            {quantity_studets ?? "Sin cantidad"}
          </div>

          <div className="tag-container mb-3">
            <label className="tag-label">AMBIENTE</label>

            <div className="pt-2 pb-2">
              <b>BLOQUE: </b> {blocks.map((b) => b) ?? "Sin bloque"}
            </div>
            <div className="row">
              <div className="col-sm-2">
                <b>AULA(s)</b>
              </div>
              <div
                className="scrol-teacher-modal col-sm-10 h-100 overflow-y-auto"
                style={{ maxHeight: "200px" }}
              >
                <Table bordered className="w-100">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Capacidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classrooms.map((each) => {
                      return (
                        <tr key={each.classroom_id}>
                          <td>{each.name}</td>
                          <td>{each.capacity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <div className="pt-3">
            <b>MOTIVO: </b> {reason ?? "Sin motivo"}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {footerContent ?? (
          <button onClick={() => setShow(false)} className="btn btn-secondary">
            Cerrar
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

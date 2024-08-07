import { Collapse, Table } from "react-bootstrap";
import { useState } from "react";

export function ElementGroup(props) {
  const {
    // group_id,
    subject_name,
    teacher_group,
    group_number,
    // person,
    schedule,
    carreers,
    period,
  } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded p-3 my-2 shadow">
      <div className="d-flex justify-content-between">
        <div>
          <b className="text-primary">MATERIA: </b>
          {subject_name}
        </div>
        <div>
          <b className="text-primary"># GRUPO: </b>
          {group_number}
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <b className="text-primary">DOCENTE: </b>
          {teacher_group}
        </div>
        <div>
          <b className="text-primary">GESTIÓN: </b>
          {period}
        </div>
      </div>
      <div className="py-2">
        <div
          onClick={() => setOpen(!open)}
          className="shadow p-2 rounded border border-dark-subtle mx-1 hover-box"
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-truncate">VER HORARIO DE CLASES</span>
            <span>
              {open ? (
                <i className="bi bi-chevron-double-up"></i>
              ) : (
                <i className="bi bi-chevron-double-down"></i>
              )}
            </span>
          </div>

          <Collapse in={open}>
            <div className="pt-2 w-100 overflow-x-auto">
              <Table bordered>
                <tbody>
                  <tr>
                    <th>DIA</th>
                    <th>HORARIO</th>
                    <th>TIPO</th>
                  </tr>
                  {schedule.map((s, index) => {
                    return (
                      <tr key={s.classroom.name + s.periods[0] + index}>
                        <td>
                          {s.day === 0
                            ? "Lunes"
                            : s.day === 1
                            ? "Martes"
                            : s.day === 2
                            ? "Miercoles"
                            : s.day === 3
                            ? "Jueves"
                            : s.day === 4
                            ? "Viernes"
                            : s.day === 5
                            ? "Sabado"
                            : "Sin horario"}
                        </td>
                        <td>{s.periods[0] + " - " + s.periods[1]}</td>
                        <td>{s.type}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Collapse>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="shadow p-2 rounded border border-dark-subtle mx-1 hover-box w-50"
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-truncate">
              VER CARRERAS ASIGNADAS AL GRUPO
            </span>
            <span>
              {open ? (
                <i className="bi bi-chevron-double-up"></i>
              ) : (
                <i className="bi bi-chevron-double-down"></i>
              )}
            </span>
          </div>

          {/* <Collapse in={open}>
            <div className="pt-2 w-100 overflow-x-auto">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Codigo</th>
                    <th>Carrera</th>
                  </tr>
                </thead>
                <tbody>
                  {carreers.map((c) => {
                    return (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Collapse> */}
        </div>
      </div>
    </div>
  );
}

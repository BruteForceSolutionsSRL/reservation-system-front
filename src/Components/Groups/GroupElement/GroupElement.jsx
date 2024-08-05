import { Collapse, Table } from "react-bootstrap";
import { useState } from "react";
import "./GroupElement.css";

export default function GroupElement(props) {
  const { group_id, subject_name, teacher_group, period, schedule, carreers } =
    props;
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
          {group_id}
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
      <div className="d-flex py-2">
        <div
          onClick={() => setOpen(!open)}
          className="shadow p-2 rounded border border-dark-subtle mx-1 hover-box w-50"
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
                  {schedule.map((s) => {
                    return (
                      <tr key={s.id_day}>
                        <td>
                          {s.id_day === 0
                            ? "Lunes"
                            : s.id_day === 1
                            ? "Martes"
                            : s.id_day === 2
                            ? "Miercoles"
                            : s.id_day === 3
                            ? "Jueves"
                            : s.id_day === 4
                            ? "Viernes"
                            : s.id_day === 5
                            ? "Sabado"
                            : "Sin horario"}
                        </td>
                        <td>{s.periods[0] + "-" + s.periods[1]}</td>
                        <td>{s.type}</td>
                        {/* Cambiar por aulas para clases */}
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

          <Collapse in={open}>
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
          </Collapse>
        </div>
      </div>
    </div>
  );
}

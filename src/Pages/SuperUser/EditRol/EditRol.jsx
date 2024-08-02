// import { useState } from "react";
// import { Button, Col, Modal, Row } from "react-bootstrap";

// export default function EditRol(props) {
//   const {
//     person_id,
//     user_name,
//     name,
//     lastname,
//     email,
//     fullname,
//     roles,
//     subjects,
//   } = props;

//   const [showModal, setShowModal] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(roles[0] || ""); // Inicializa con el primer valor de roles
//   const [responseTitle, setResponseTitle] = useState("");
//   const [responseMessage, setResponseMessage] = useState("");
//   const [showResponseModal, setShowResponseModal] = useState(false);

//   const handleClickEdit = () => {
//     setSelectedRole(roles[0] || ""); // Actualiza el estado selectedRole con el primer valor de roles
//     setShowModal(true);
//     console.log(`Editar informacion de ${person_fullname}, ${person_id}`);
//     console.log(props);
//     console.log(selectedRole);
//   };

//   const handleClose = () => setShowModal(false);

//   const handleRoleChange = (event) => {
//     setSelectedRole(event.target.value);
//   };

//   const handleAccept = async () => {
//     const token = localStorage.getItem("token");
//     const url = `http://localhost:8000/api/users/${person_id}/assignRoles`;

//     const role_id = selectedRole === "DOCENTE" ? "1" : "2";
//     console.log(role_id, person_id);

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ role_ids: [role_id] }),
//       });

//       const responseData = await response.json();
//       setResponseMessage(responseData.message);

//       if (response.ok) {
//         setResponseTitle("Éxito");
//         console.log("Rol actualizado:", responseData);
//       } else {
//         setResponseTitle(`Error ${response.status}`);
//         console.error("Failed to update role");
//         console.log(props);
//       }
//     } catch (error) {
//       setResponseMessage("Error al actualizar el rol.");
//       setResponseTitle("Error");
//       console.error("Error:", error);
//       console.log(props);
//     }

//     setShowModal(false);
//     setShowResponseModal(true);
//   };

//   return (
//     <>
//       <div className="border border-dark rounded p-3 my-2">
//         <Row>
//           <Col lg>
//             <b className="text-primary">NOMBRE:</b>
//             <div>
//               <span>{fullname}</span>
//             </div>
//           </Col>

//           <Col lg>
//             <b className="text-primary">MATERIAS:</b>
//             <div>
//               <span>
//                 {subjects ? (
//                   subjects.length > 0 ? (
//                     subjects.map((subject) => (
//                       <div key={subject.subject_id}>
//                         <span>
//                           <strong>*</strong>
//                           {subject.subject_name}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <span>No hay materias asignadas</span>
//                   )
//                 ) : (
//                   <span>No hay materias asignadas</span>
//                 )}
//               </span>
//             </div>
//           </Col>
//           <Col>
//             <b className="text-primary">ROL:</b>
//             <div>
//               <span>{roles.join(", ")}</span>
//             </div>
//           </Col>
//           <Col lg className="align-self-center d-flex justify-content-end">
//             <Button
//               className="custom-button btn btn-primary custom-btn-primary-outline w-50"
//               onClick={handleClickEdit}
//             >
//               Editar Rol
//             </Button>
//           </Col>
//         </Row>
//       </div>
//       {/* --- */}
//       <Modal show={showModal} onHide={handleClose} centered backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>Editar Rol</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {["DOCENTE", "ENCARGADO"].map((roleOption) => (
//             <div className="form-check" key={roleOption}>
//               <input
//                 className="form-check-input"
//                 type="radio"
//                 name="roleOptions"
//                 id={`${roleOption}Option`}
//                 value={roleOption}
//                 checked={selectedRole === roleOption}
//                 onChange={handleRoleChange}
//               />
//               <label
//                 className="form-check-label"
//                 htmlFor={`${roleOption}Option`}
//               >
//                 {roleOption}
//               </label>
//             </div>
//           ))}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button
//             className="btn btn-primary custom-btn-primary-outline"
//             variant="primary"
//             onClick={handleAccept}
//           >
//             Aceptar
//           </Button>
//           <Button
//             className="btn btn-secondary custom-btn-gray-outline"
//             variant="secondary"
//             onClick={handleClose}
//           >
//             Cerrar
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal de respuesta del servidor */}
//       <Modal
//         show={showResponseModal}
//         onHide={() => setShowResponseModal(false)}
//         centered
//         backdrop="static"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>{responseTitle}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>{responseMessage}</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             className="btn btn-primary custom-btn-primary-outline"
//             variant="primary"
//             onClick={() => setShowResponseModal(false)}
//           >
//             Cerrar
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

import { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";

export default function EditRol(props) {
  const {
    person_id,
    user_name,
    name,
    lastname,
    email,
    fullname,
    roles,
    subjects,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roles[0] || "");
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);

  const handleClickEdit = () => {
    setSelectedRole(roles[0] || "");
    setShowModal(true);
    console.log(`Editar informacion de ${fullname}, ${person_id}`);
    console.log(props);
    console.log(selectedRole);
  };

  const handleClose = () => setShowModal(false);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleAccept = async () => {
    const token = localStorage.getItem("token");
    const url = `http://localhost:8000/api/users/${person_id}/assignRoles`;

    const role_id = selectedRole === "DOCENTE" ? "1" : "2";
    console.log(role_id, person_id);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_ids: [role_id] }),
      });

      const responseData = await response.json();
      setResponseMessage(responseData.message);

      if (response.ok) {
        setResponseTitle("Éxito");
        console.log("Rol actualizado:", responseData);
      } else {
        setResponseTitle(`Error ${response.status}`);
        console.error("Failed to update role");
        console.log(props);
      }
    } catch (error) {
      setResponseMessage("Error al actualizar el rol.");
      setResponseTitle("Error");
      console.error("Error:", error);
      console.log(props);
    }

    setShowModal(false);
    setShowResponseModal(true);
  };

  return (
    <>
      <div className="border border-dark rounded p-3 my-2">
        <Row>
          <Col lg>
            <b className="text-primary">NOMBRE:</b>
            <div>
              <span>{fullname}</span>
            </div>
          </Col>

          <Col lg>
            <b className="text-primary">MATERIAS:</b>
            <div>
              <span>
                {subjects ? (
                  subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <div key={subject.subject_id}>
                        <span>
                          <strong>*</strong>
                          {subject.subject_name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span>No hay materias asignadas</span>
                  )
                ) : (
                  <span>No hay materias asignadas</span>
                )}
              </span>
            </div>
          </Col>
          <Col>
            <b className="text-primary">ROL:</b>
            <div>
              <span>{roles.join(", ")}</span>
            </div>
          </Col>
          <Col lg className="align-self-center d-flex justify-content-end">
            <Button
              className="custom-button btn btn-primary custom-btn-primary-outline w-50"
              onClick={handleClickEdit}
            >
              Editar Rol
            </Button>
          </Col>
        </Row>
      </div>
      {/* --- */}
      <Modal show={showModal} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Editar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <b>ID:</b> {person_id}
          </div>
          <div>
            <b>Nombre de usuario:</b> {user_name}
          </div>
          <div>
            <b>Nombre:</b> {name}
          </div>
          <div>
            <b>Apellido:</b> {lastname}
          </div>
          <div>
            <b>Email:</b> {email}
          </div>
          <div>
            <b>Nombre completo:</b> {fullname}
          </div>
          <div>
            <b>Materias:</b>
            <ul>
              {subjects && subjects.length > 0 ? (
                subjects.map((subject) => (
                  <li key={subject.subject_id}>{subject.subject_name}</li>
                ))
              ) : (
                <li>No hay materias asignadas</li>
              )}
            </ul>
          </div>
          <div>
            <b>Rol:</b>
            {["DOCENTE", "ENCARGADO"].map((roleOption) => (
              <div className="form-check" key={roleOption}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="roleOptions"
                  id={`${roleOption}Option`}
                  value={roleOption}
                  checked={selectedRole === roleOption}
                  onChange={handleRoleChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${roleOption}Option`}
                >
                  {roleOption}
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="btn btn-primary custom-btn-primary-outline"
            variant="primary"
            onClick={handleAccept}
          >
            Aceptar
          </Button>
          <Button
            className="btn btn-secondary custom-btn-gray-outline"
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de respuesta del servidor */}
      <Modal
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{responseTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{responseMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary custom-btn-primary-outline"
            variant="primary"
            onClick={() => setShowResponseModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

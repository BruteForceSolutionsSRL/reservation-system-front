// import {
//   Button,
//   Col,
//   Container,
//   Form,
//   InputGroup,
//   Modal,
//   Row,
//   Spinner,
//   Table,
// } from "react-bootstrap";
// import "./InformationUser.css";
// import { useState } from "react";

// export default function InformationUser() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [changes, setChanges] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingModal, setLoadingModal] = useState(false);
//   const [show, setShow] = useState(false);
//   const [changesState, setChangesState] = useState({});
//   const [modifiedFields, setModifiedFields] = useState({});
//   // // ('{"person_id":26,
//   // //   "name":"DANIEL",
//   // //   "last_name":"GARCIA CUCHALLO",
//   // //   "email":"qtimpo1@gmail.com",
//   // //   "roles":["ENCARGADO"]}');

//   // Obtén los datos almacenados en localStorage y conviértelos a un objeto JavaScript
//   const originalData1String = localStorage.getItem("userInformation");

//   // Datos originales (definidos fuera del bloque condicional)
//   const originalData = {
//     Nombre: "Juan",
//     "Segundo Nombre": "Carlos",
//     "Apellido Paterno": "Pérez",
//     "Apellido Materno": "Gómez",
//     nombreUsuario: "juan_carlos",
//     contraseña: "contrasena123",
//     "Correo Principal": "juan.perez@example.com",
//     "Correo Secundario": "jcarlos.gomez@example.com",
//     celular: "1234567890",
//     Rol: "admin",
//   };

//   // Verifica si originalData1String existe y conviértelo a un objeto
//   if (originalData1String) {
//     const originalData1 = JSON.parse(originalData1String);

//     // Imprime los datos para depuración
//     console.log(originalData1, originalData);

//     // Asigna los valores de originalData1 a las propiedades correspondientes en originalData
//     originalData.Nombre = originalData1.name;
//     originalData["Apellido Paterno"] = originalData1.last_name.split(" ")[0];
//     originalData["Apellido Materno"] = originalData1.last_name.split(" ")[1];
//     originalData["Correo Principal"] = originalData1.email;
//     originalData.Rol = originalData1.roles[0];

//     // Imprime los datos actualizados para verificar
//     console.log(originalData);
//   } else {
//     console.log("No data found in localStorage.");
//   }

//   const [notificationSettings, setNotificationSettings] = useState({
//     correoPrincipal: originalData.correo1,
//     correoSecundario: originalData.correo2,
//     numeroCelular: originalData.celular,
//   });

//   const [formData, setFormData] = useState({ ...originalData });

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//     console.log(originalData1);
//   };

//   const handleClose = () => {
//     setShow(false);
//   };

//   const handleAcceptClick = () => {
//     setLoadingModal(true);
//     // Aquí puedes manejar la aceptación de los cambios
//     setTimeout(() => {
//       setLoadingModal(false);
//       setShow(false);
//     }, 1000); // Simula un retraso de 1 segundo para la aceptación
//   };

//   const handleCancelClick = () => {
//     setShow(false);
//   };

//   const handleCheckboxChange = (e) => {
//     const { id, checked } = e.target;
//     setNotificationSettings((prev) => ({
//       ...prev,
//       [id]: checked,
//     }));
//     setChanges(true); // Marca que se ha realizado un cambio
//     setModifiedFields((prevModifiedFields) => ({
//       ...prevModifiedFields,
//       [id]: checked !== (originalData[id] || false), // Cambiado para verificar cambios
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//     setChanges(true); // Marca que se ha realizado un cambio
//     setModifiedFields((prevModifiedFields) => ({
//       ...prevModifiedFields,
//       [name]: value !== originalData[name],
//     }));
//     console.log(modifiedFields);
//   };

//   const handleSaveChanges = () => {
//     if (!Object.values(notificationSettings).some((value) => value)) {
//       alert("Debe seleccionar al menos una opción de notificación.");
//       return;
//     }

//     setIsLoading(true);

//     const detectedChanges = getChanges();
//     setChangesState(detectedChanges);
//     console.log("Datos cambiados:", detectedChanges);

//     // Simula una solicitud de guardado con un timeout
//     setTimeout(() => {
//       setIsLoading(false);
//       // Aquí puedes manejar el guardado de cambios
//     }, 1000);
//     setShow(true);
//   };

//   const getChanges = () => {
//     const changes = {};

//     // Check for changes in formData
//     Object.keys(formData).forEach((key) => {
//       if (formData[key] !== originalData[key]) {
//         changes[key] = formData[key];
//       }
//     });

//     // Check for changes in notificationSettings
//     Object.keys(notificationSettings).forEach((key) => {
//       if (notificationSettings[key] !== originalData[key]) {
//         changes[key] = notificationSettings[key]
//           ? "Habilitado"
//           : "Deshabilitado";
//       }
//     });

//     return changes;
//   };

//   const updateUser = async (token, formData, notificationSettings) => {
//     // Define la URL del endpoint
//     const url = "http://localhost:8000/api/users/update";

//     // Define los datos actualizados
//     const updatedData = {
//       nombre1: formData.nombre1,
//       nombre2: formData.nombre2,
//       apellido1: formData.apellido1,
//       apellido2: formData.apellido2,
//       nombreUsuario: formData.nombreUsuario,
//       contraseña: formData.contraseña,
//       correo1: formData.correo1,
//       correo2: formData.correo2,
//       celular: formData.celular,
//       rol: formData.rol,
//       notificaciones: {
//         correoPrincipal: notificationSettings.correoPrincipal,
//         correoSecundario: notificationSettings.correoSecundario,
//         numeroCelular: notificationSettings.numeroCelular,
//       },
//     };

//     try {
//       // Realiza la solicitud fetch
//       const response = await fetch(url, {
//         method: "POST", // Método HTTP POST
//         headers: {
//           "Content-Type": "application/json", // Tipo de contenido de la solicitud
//           Authorization: `Bearer ${token}`, // Token de autenticación
//         },
//         body: JSON.stringify(updatedData), // Datos actualizados convertidos a JSON
//       });

//       // Verifica si la respuesta fue exitosa
//       if (!response.ok) {
//         // Si la respuesta no es exitosa, lanza un error con el estado HTTP
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Convierte la respuesta en JSON
//       const data = await response.json();

//       // Imprime la respuesta en la consola
//       console.log("Response:", data);
//     } catch (error) {
//       // Maneja cualquier error que ocurra durante la solicitud
//       console.error("There was a problem with the fetch operation:", error);
//     }
//   };

//   return (
//     <>
//       <Container>
//         <h1 className="text-center py-4">Información de Usuario</h1>
//         <hr className="mb-4" />
//         <div className="tag-container mb-3">
//           <label className="tag-label">INFORMACIÓN BÁSICA</label>
//           <div>
//             <Row className="mb-2">
//               <Col lg>
//                 <Form.Label>Nombre(s)</Form.Label>
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="nombre1"
//                   value={formData.nombre1}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.nombre1 ? "3px solid #00ff66" : "",
//                   }}
//                 />
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="nombre2"
//                   value={formData.nombre2}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.nombre2 ? "3px solid #00ff66" : "",
//                   }}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-2">
//               <Col lg>
//                 <Form.Label>Apellido(s)</Form.Label>
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="apellido1"
//                   value={formData.apellido1}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.apellido1 ? "3px solid #00ff66" : "",
//                   }}
//                 />
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="apellido2"
//                   value={formData.apellido2}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.apellido2 ? "3px solid #00ff66" : "",
//                   }}
//                 />
//               </Col>
//             </Row>

//             <Row>
//               <Col lg>
//                 <Form.Label>Nombre de usuario</Form.Label>
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="nombreUsuario"
//                   value={formData.nombreUsuario}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.nombreUsuario
//                       ? "3px solid #00ff66"
//                       : "",
//                   }}
//                 />
//               </Col>
//               <Col lg>
//                 <Form.Label>Contraseña</Form.Label>
//               </Col>
//               <Col md style={{ position: "relative" }}>
//                 <Form.Control
//                   className="text-truncate"
//                   style={{
//                     border: modifiedFields.contraseña
//                       ? "3px solid #00ff66"
//                       : "",
//                   }}
//                   type={showPassword ? "text" : "password"}
//                   name="contraseña"
//                   value={formData.contraseña}
//                   onChange={handleInputChange}
//                 />
//                 <i
//                   className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
//                   onClick={togglePasswordVisibility}
//                   style={{
//                     position: "absolute",
//                     right: "20px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     cursor: "pointer",
//                   }}
//                 ></i>
//               </Col>
//             </Row>
//           </div>
//         </div>
//         <div className="tag-container mb-3">
//           <label className="tag-label">INFORMACIÓN DE CONTACTO</label>
//           <div>
//             <Row className="mb-2">
//               <Col>
//                 <Form.Label>Correo Principal</Form.Label>
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="correo1"
//                   value={formData.correo1}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.correo1 ? "3px solid #00ff66" : "",
//                   }}
//                 />
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="correo2"
//                   value={formData.correo2}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.correo2 ? "3px solid #00ff66" : "",
//                   }}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-2">
//               <Col>
//                 <Form.Label>Número de celular</Form.Label>
//               </Col>
//               <Col>
//                 <Form.Control
//                   type="input"
//                   name="celular"
//                   value={formData.celular}
//                   onChange={handleInputChange}
//                   style={{
//                     border: modifiedFields.celular ? "3px solid #00ff66" : "",
//                   }}
//                 />
//               </Col>
//             </Row>
//             <Row>
//               <div className="tag-container mb-3">
//                 <label className="tag-label">NOTIFICACIONES</label>
//                 <div>
//                   <Row>
//                     <Col>
//                       <Form.Check
//                         type="checkbox"
//                         id="correoPrincipal"
//                         label="Correo Principal"
//                         checked={notificationSettings.correoPrincipal}
//                         onChange={handleCheckboxChange}
//                       />
//                     </Col>
//                     <Col>
//                       <Form.Check
//                         type="checkbox"
//                         id="correoSecundario"
//                         label="Correo Secundario"
//                         checked={notificationSettings.correoSecundario}
//                         onChange={handleCheckboxChange}
//                       />
//                     </Col>
//                     <Col>
//                       <Form.Check
//                         type="checkbox"
//                         id="numeroCelular"
//                         label="Número de celular"
//                         checked={notificationSettings.numeroCelular}
//                         onChange={handleCheckboxChange}
//                       />
//                     </Col>
//                   </Row>
//                 </div>
//               </div>
//             </Row>
//           </div>
//         </div>
//         <div className="tag-container mb-3">
//           <label className="tag-label">INFORMACIÓN ACADÉMICA</label>
//           <div>
//             <Row>
//               <Col>
//                 <Form.Label>Rol</Form.Label>
//               </Col>
//               <Col>
//                 <Form.Control type="input" disabled value={formData.rol} />
//               </Col>
//             </Row>

//             <Row>
//               <Col>
//                 <div className="table-scroll">
//                   <Table striped bordered hover className="mt-1">
//                     <thead>
//                       <tr>
//                         <th
//                           className="sticky-header text-center"
//                           style={{
//                             backgroundColor: "rgb(4, 94, 140)",
//                             color: "white",
//                             userSelect: "none",
//                           }}
//                         >
//                           Materia
//                         </th>
//                         <th
//                           className="sticky-header text-center"
//                           style={{
//                             backgroundColor: "rgb(4, 94, 140)",
//                             color: "white",
//                             userSelect: "none",
//                           }}
//                         >
//                           Grupo
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr style={{ cursor: "pointer" }}>
//                         <td style={{ userSelect: "none" }}>dato</td>
//                         <td style={{ userSelect: "none" }}>dato</td>
//                       </tr>
//                       <tr>
//                         <td>dato</td>
//                         <td>dato</td>
//                       </tr>
//                       <tr>
//                         <td>dato</td>
//                         <td>dato</td>
//                       </tr>
//                       <tr>
//                         <td>dato</td>
//                         <td>dato</td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//         <div className="d-flex justify-content-end mt-3">
//           {changes && (
//             <>
//               {isLoading && (
//                 <Spinner
//                   className="me-3"
//                   as="span"
//                   animation="border"
//                   size="lg"
//                   role="status"
//                   aria-hidden="true"
//                 />
//               )}
//               <Button
//                 variant="success"
//                 className="custom-btn-green custom-btn-green-outline btn btn-success"
//                 type="button" // Cambié de "submit" a "button" para evitar el comportamiento por defecto del formulario
//                 onClick={handleSaveChanges} // Agregué la función de manejador aquí
//               >
//                 Guardar cambios
//               </Button>
//             </>
//           )}
//         </div>
//       </Container>
//       <Modal show={show} centered onHide={handleClose} backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>¡Confirmación!</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div>Está seguro de continuar con los siguientes cambios:</div>
//           <div>
//             <ul>
//               {Object.entries(changesState).map(([key, value]) => (
//                 <li key={key}>
//                   <strong>{key}</strong>: {value}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           {loadingModal ? <Spinner animation="border" /> : ""}

//           <Button
//             variant="primary"
//             className="btn btn-primary custom-btn-primary-outline"
//             onClick={handleAcceptClick}
//             disabled={loadingModal}
//           >
//             Aceptar
//           </Button>
//           <Button
//             variant="secondary"
//             className="btn btn-secondary custom-btn-gray-outline"
//             onClick={handleCancelClick}
//             disabled={loadingModal}
//           >
//             Cancelar
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal>
//         <Modal.Header>
//           <Modal.Title> </Modal.Title>
//         </Modal.Header>
//         <Modal.Body></Modal.Body>
//         <Modal.Footer></Modal.Footer>
//       </Modal>
//     </>
//   );
// }

import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import "./InformationUser.css";
import { useState } from "react";

export default function InformationUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [changes, setChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [show, setShow] = useState(false);
  const [changesState, setChangesState] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});

  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Obtén los datos almacenados en localStorage y conviértelos a un objeto JavaScript
  const originalData1String = localStorage.getItem("userInformation");

  // Datos originales (definidos fuera del bloque condicional)
  const originalData = {
    Nombre: "",
    "Segundo Nombre": "",
    "Apellido Paterno": "",
    "Apellido Materno": "",
    nombreUsuario: "",
    contraseña: "",
    "Correo Principal": "",
    "Correo Secundario": "",
    celular: "",
    Rol: "",
  };

  // Verifica si originalData1String existe y conviértelo a un objeto
  if (originalData1String) {
    const originalData1 = JSON.parse(originalData1String);

    // Asigna los valores de originalData1 a las propiedades correspondientes en originalData
    originalData.Nombre = originalData1.name.split(" ")[0];
    originalData["Segundo Nombre"] = originalData1.name.split(" ")[1];
    originalData["Apellido Paterno"] = originalData1.last_name.split(" ")[0];
    originalData["Apellido Materno"] = originalData1.last_name.split(" ")[1];
    originalData["Correo Principal"] = originalData1.email;
    originalData.Rol = originalData1.roles[0];
  } else {
    console.log("No data found in localStorage.");
  }

  const [notificationSettings, setNotificationSettings] = useState({
    "Correo Principal": originalData["Correo Principal"],
    "Correo Secundario": originalData["Correo Secundario"],
    celular: originalData.celular,
  });
  const [initialFormData, setInitialFormData] = useState({ ...originalData });

  const [formData, setFormData] = useState({ ...originalData });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleCancelEdit = () => {
    setFormData({ ...initialFormData });
    console.log(initialFormData, originalData);
    setNotificationSettings({
      "Correo Principal": initialFormData["Correo Principal"],
      "Correo Secundario": initialFormData["Correo Secundario"],
      celular: initialFormData.celular,
    });
    setChanges(false);
    setModifiedFields({});
  };

  const handleAcceptClick = () => {
    setLoadingModal(true);
    setTimeout(() => {
      setLoadingModal(false);
      setShow(false);
    }, 1000);

    const detectedChanges = getChanges();
    updateUser(detectedChanges);
  };

  const handleCancelClick = () => {
    setShow(false);
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [id]: checked,
    }));
    setChanges(true); // Marca que se ha realizado un cambio
    setModifiedFields((prevModifiedFields) => ({
      ...prevModifiedFields,
      [id]: checked !== (originalData[id] || false), // Cambiado para verificar cambios
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setChanges(true); // Marca que se ha realizado un cambio
    setModifiedFields((prevModifiedFields) => ({
      ...prevModifiedFields,
      [name]: value !== originalData[name],
    }));
  };

  const handleSaveChanges = () => {
    if (!Object.values(notificationSettings).some((value) => value)) {
      alert("Debe seleccionar al menos una opción de notificación.");
      return;
    }

    setIsLoading(true);

    const detectedChanges = getChanges();
    setChangesState(detectedChanges);
    console.log("Datos cambiados:", detectedChanges);

    // Simula una solicitud de guardado con un timeout
    setTimeout(() => {
      setIsLoading(false);
      // Aquí puedes manejar el guardado de cambios
    }, 1000);
    setShow(true);
  };

  // const getChanges = () => {
  //   const changes = {};

  //   // Check for changes in formData
  //   Object.keys(formData).forEach((key) => {
  //     if (formData[key] !== originalData[key]) {
  //       changes[key] = formData[key];
  //     }
  //   });

  //   // Check for changes in notificationSettings
  //   Object.keys(notificationSettings).forEach((key) => {
  //     if (notificationSettings[key] !== originalData[key]) {
  //       changes[key] = notificationSettings[key]
  //         ? "Habilitado"
  //         : "Deshabilitado";
  //     }
  //   });

  //   return changes;
  // };

  const getChanges = () => {
    const changes = {};

    if (formData.Nombre !== originalData.Nombre) {
      changes.name = formData.Nombre;
    }
    if (formData["Segundo Nombre"] !== originalData["Segundo Nombre"]) {
      changes.second_name = formData["Segundo Nombre"];
    }
    if (formData["Apellido Paterno"] !== originalData["Apellido Paterno"]) {
      changes.last_name = formData["Apellido Paterno"];
    }
    if (formData["Apellido Materno"] !== originalData["Apellido Materno"]) {
      changes.last_name = changes.last_name
        ? `${changes.last_name} ${formData["Apellido Materno"]}`
        : `${originalData["Apellido Paterno"]} ${formData["Apellido Materno"]}`;
    }
    if (formData.nombreUsuario !== originalData.nombreUsuario) {
      changes.user_name = formData.nombreUsuario;
    }
    if (formData.contraseña !== originalData.contraseña) {
      changes.password = formData.contraseña;
    }
    if (formData["Correo Principal"] !== originalData["Correo Principal"]) {
      changes.email = formData["Correo Principal"];
    }
    if (formData["Correo Secundario"] !== originalData["Correo Secundario"]) {
      changes.secondary_email = formData["Correo Secundario"];
    }
    if (formData.celular !== originalData.celular) {
      changes.phone = formData.celular;
    }

    return changes;
  };

  // Define la URL del endpoint
  const url = "http://localhost:8000/api/users/update";

  // Define los datos a enviar en la solicitud POST
  const data = {
    user_name: "johndoe",
    email: "john.doe@example.com",
    name: "John",
    last_name: "Doe",
  };

  // Obtén el token de localStorage
  const token = localStorage.getItem("token"); // Cambia 'authToken' por la clave que usas para almacenar el token

  // Define una función asíncrona para enviar los datos
  const updateUser = async (changes) => {
    console.log(changes);
    try {
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await fetch(url, {
        method: "POST", // Método HTTP POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      setModalContent({
        title: "Éxito",
        message: result.message || "Operación exitosa",
      });
      setShowResponseModal(true);

      console.log("Response:", result);
    } catch (error) {
      setModalContent({
        title: "Error",
        message: error.message || "Hubo un problema con la operación",
      });
      setShowResponseModal(true);

      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <>
      <Container>
        <h1 className="text-center py-4">Información de Usuario</h1>
        <hr className="mb-4" />
        <div className="tag-container mb-3">
          <label className="tag-label">INFORMACIÓN BÁSICA</label>
          <div>
            <Row className="mb-2">
              <Col lg>
                <Form.Label>Nombre(s)</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields.Nombre ? "3px solid #00ff66" : "",
                  }}
                />
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Segundo Nombre"
                  value={formData["Segundo Nombre"]}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields["Segundo Nombre"]
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col lg>
                <Form.Label>Apellido(s)</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Apellido Paterno"
                  value={formData["Apellido Paterno"]}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields["Apellido Paterno"]
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Apellido Materno"
                  value={formData["Apellido Materno"]}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields["Apellido Materno"]
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col lg>
                <Form.Label>Nombre de usuario</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields.nombreUsuario
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
              <Col lg>
                <Form.Label>Contraseña</Form.Label>
              </Col>
              <Col md style={{ position: "relative" }}>
                <Form.Control
                  className="text-truncate"
                  style={{
                    border: modifiedFields.contraseña
                      ? "3px solid #00ff66"
                      : "",
                  }}
                  type={showPassword ? "text" : "password"}
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleInputChange}
                />
                <i
                  className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                ></i>
              </Col>
            </Row>
          </div>
        </div>
        <div className="tag-container mb-3">
          <label className="tag-label">INFORMACIÓN DE CONTACTO</label>
          <div>
            <Row className="mb-2">
              <Col>
                <Form.Label>Correo Principal</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Correo Principal"
                  value={formData["Correo Principal"]}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields["Correo Principal"]
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Correo Secundario"
                  value={formData["Correo Secundario"]}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields["Correo Secundario"]
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Label>Número de celular</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields.celular ? "3px solid #00ff66" : "",
                  }}
                />
              </Col>
            </Row>
            <Row>
              <div className="tag-container mb-3">
                <label className="tag-label">NOTIFICACIONES</label>
                <div>
                  <Row>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        id="Correo Principal"
                        label="Correo Principal"
                        checked={notificationSettings["Correo Principal"]}
                        onChange={handleCheckboxChange}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        id="Correo Secundario"
                        label="Correo Secundario"
                        checked={notificationSettings["Correo Secundario"]}
                        onChange={handleCheckboxChange}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        id="celular"
                        label="Número de celular"
                        checked={notificationSettings.celular}
                        onChange={handleCheckboxChange}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Row>
          </div>
        </div>
        <div className="tag-container mb-3">
          <label className="tag-label">INFORMACIÓN ACADÉMICA</label>
          <div>
            <Row>
              <Col>
                <Form.Label>Rol</Form.Label>
              </Col>
              <Col>
                <Form.Control type="input" disabled value={formData.Rol} />
              </Col>
            </Row>

            <Row>
              <Col>
                <div className="table-scroll">
                  <Table striped bordered hover className="mt-1">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "rgb(4, 94, 140)",
                          color: "white",
                        }}
                      >
                        <th className="text-center">Materia</th>
                        <th className="text-center">Grupo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>dato</td>
                        <td>dato</td>
                      </tr>
                      <tr>
                        <td>dato</td>
                        <td>dato</td>
                      </tr>
                      <tr>
                        <td>dato</td>
                        <td>dato</td>
                      </tr>
                      <tr>
                        <td>dato</td>
                        <td>dato</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          {changes && (
            <>
              {isLoading && (
                <Spinner
                  className="me-3"
                  as="span"
                  animation="border"
                  size="lg"
                  role="status"
                  aria-hidden="true"
                />
              )}

              <Button
                className="custom-btn-green custom-btn-green-outline btn btn-success"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                Cancelar Edición
              </Button>
              <Button
                variant="success"
                className="custom-btn-green custom-btn-green-outline btn btn-success"
                type="button" // Cambié de "submit" a "button" para evitar el comportamiento por defecto del formulario
                onClick={handleSaveChanges} // Agregué la función de manejador aquí
              >
                Guardar cambios
              </Button>
            </>
          )}
        </div>
      </Container>
      <Modal show={show} centered onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>¡Confirmación!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Está seguro de continuar con los siguientes cambios:</div>
          <div>
            <ul>
              {Object.entries(changesState).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {value}
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {loadingModal ? <Spinner animation="border" /> : ""}

          <Button
            variant="primary"
            className="btn btn-primary custom-btn-primary-outline"
            onClick={handleAcceptClick}
            disabled={loadingModal}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            className="btn btn-secondary custom-btn-gray-outline"
            onClick={handleCancelClick}
            disabled={loadingModal}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResponseModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

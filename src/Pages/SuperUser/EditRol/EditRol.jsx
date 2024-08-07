import { useState, useEffect } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import "./EditRol.css";

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

  const [showModalCambios, setShowModalCambios] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roles[0] || "");
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);

  const [modifiedFields, setModifiedFields] = useState({});
  const [changes, setChanges] = useState(false);
  const [formData, setFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [showEditarRol, setShowEditarRol] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [showResponseModalUpdate, setShowResponseModalUpdate] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [changesState, setChangesState] = useState({});

  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const URL = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    setInitialFormData({
      person_id,
      user_name,
      name,
      lastname,
      email,
    });
    setFormData({
      person_id,
      user_name,
      name,
      lastname,
      email,
    });
  }, [person_id, user_name, name, lastname, email]);

  const [data, setData] = useState({});

  const updateData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleClickEdit = () => {
    setSelectedRole(roles[0] || "");
    setShowModalInformacion(true);
    console.log(localStorage.getItem("userInformation"));
    console.log(JSON.parse(localStorage.getItem("userInformation")));
    // console.log(`Editar informacion de ${fullname}, ${person_id}`);
    // console.log("Roles:", roles);
    // console.log("Selected Role:", selectedRole);
  };

  const handleClose = () => {
    setShowModalInformacion(false);
    handleCancelEdit();
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleAccept = async () => {
    const token = localStorage.getItem("token");
    const role_id = selectedRole === "DOCENTE" ? "2" : "1";
    console.log(
      "Role ID:",
      role_id,
      "Person ID:",
      person_id,
      "Selected Role:",
      selectedRole
    );

    try {
      const response = await fetch(`${URL}users/${person_id}/assignRoles`, {
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
        setResponseMessage(
          responseData.message ||
            `El rol del usuario "${responseData.fullname}" se actualizó a: "${responseData.roles[0]}"`
        );
        console.log("Rol actualizado:", responseData);
      } else {
        setResponseTitle(`Error ${response.status}`);
        console.error("Failed to update role:", responseData);
      }
    } catch (error) {
      setResponseMessage("Error al actualizar el rol.");
      setResponseTitle("Error");
      console.error("Error:", error);
    }

    // setShowModal(false);
    setShowResponseModal(true);
  };

  const handleResponseModal = () => {
    setShowResponseModal(false);
    setShowEditarRol(false);
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };
      const hasChanges = Object.keys(newFormData).some(
        (key) => newFormData[key] !== initialFormData[key]
      );
      setChanges(hasChanges);

      setModifiedFields((prevModifiedFields) => ({
        ...prevModifiedFields,
        [name]: value !== initialFormData[name],
      }));

      updateData(name, value);
      return newFormData;
    });
  };

  const handleSaveChanges = () => {
    setIsLoading(true);

    const detectedChanges = getChanges();
    setChangesState(detectedChanges);

    setData((prevData) => ({ ...prevData, ...detectedChanges }));

    console.log("cambios detectados", detectedChanges, "data previa", data);

    setTimeout(() => {
      setIsLoading(false);
      setShowModalCambios(true);
    }, 1000);
  };

  // {
  //   person_id: 109,
  //   user_name: 'holacomoestas',
  //   name: 'esto es una prueba',
  //   lastname: 'zapato roto rotisimos',
  //   email: 'correo@gmail.com'
  // }
  ///////////////////////
  //   initialFormData
  //   person_id: 109,
  //   user_name: 'holacomoestas',
  //   name: 'esto es una prueba',
  //   lastname: 'zapato roto rotisimo',
  //   email: 'correo@gmail.com'
  // }

  const getChanges = () => {
    const changes = {};

    if (formData.name !== initialFormData.name) {
      changes.Nombre = formData.name;
    }

    if (formData.lastname !== initialFormData.lastname) {
      changes.Apellido = formData.lastname;
    }

    if (formData.user_name !== initialFormData.user_name) {
      changes["Nombre de Usuario"] = formData.user_name;
    }

    if (formData.email !== initialFormData.email) {
      changes["Correo Principal"] = formData.email;
    }

    return changes;
  };

  const updateUser = async (sendData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(URL + "users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sendData),
      });
      const data = await response.json();
      console.log(data);

      if (response.status >= 200 && response.status < 300) {
        console.log(data);

        setModalContent({
          title: "Éxito",
          message:
            data.message ?? "Información del usuario actualizada con éxito.",
        });
      } else {
        setModalContent({
          title: "Error",
          message:
            data.message ?? "Error al actualizar la información del usuario.",
        });
      }
    } catch (error) {
      setModalContent({
        title: "Error",
        message: "Error de conexión con el servidor.",
      });
    }
    console.log(modalContent);

    setShowResponseModal(true);
  };

  const handleCancelEdit = () => {
    setFormData({ ...initialFormData });
    setChanges(false);
    setModifiedFields({});
  };

  const handleOnClickRS = () => {
    if (modalContent.title === "Éxito") {
      setShowResponseModal(false);
      window.location.reload();
    } else {
      setShowResponseModal(false);
    }
  };

  // modal cambios

  const handleCloseModalCambios = () => {
    setShowModalCambios(false);
  };

  const handleAccepCambios = () => {
    setLoadingModal(true);
    setTimeout(() => {
      setLoadingModal(false);
      setShowModalCambios(false);
    }, 1000);
    console.log(data);

    updateUser(data);
  };

  const handleCancelCambios = () => {
    setShowModalCambios(false);
  };

  //sameperson
  const sameperson = () => {
    let person = JSON.parse(localStorage.getItem("userInformation"));
    console.log(person);

    // if (condition) {
    // }
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
          {/* 
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
          </Col> */}
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
              Editar
            </Button>
          </Col>
        </Row>
      </div>
      {/* --- */}
      <Modal
        size="lg"
        show={showModalInformacion}
        onHide={handleClose}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Informacion de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="tag-container mb-3">
              <label className="tag-label">INFORMACIÓN BÁSICA</label>
              <div>
                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>ID</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      name="person_id"
                      value={formData.person_id || ""}
                      onChange={handleInputChange}
                      style={{
                        border: modifiedFields.person_id
                          ? "3px solid #00ff66"
                          : "",
                      }}
                      disabled
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>Nombre</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      style={{
                        border: modifiedFields.name ? "3px solid #00ff66" : "",
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>Apellido</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      name="lastname"
                      value={formData.lastname || ""}
                      onChange={handleInputChange}
                      style={{
                        border: modifiedFields.lastname
                          ? "3px solid #00ff66"
                          : "",
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>Nombre de usuario</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      name="user_name"
                      value={formData.user_name || ""}
                      onChange={handleInputChange}
                      style={{
                        border: modifiedFields.user_name
                          ? "3px solid #00ff66"
                          : "",
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>Contraseña</Form.Label>
                  </Col>
                  <Col md style={{ position: "relative" }}>
                    <Button
                      className="btn btn-primary custom-btn-primary-outline"
                      // onClick={handleCambiar}
                    >
                      Cambiar Contraseña
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Label>Rol</Form.Label>
                  </Col>
                  <Col md={3}>
                    <Form.Control type="text" disabled value={roles[0]} />
                  </Col>
                  <Col md={3}>
                    <Button
                      variant="success"
                      className="btn btn-success custom-btn-green-outline w-10"
                      onClick={() => {
                        setShowEditarRol(true);
                      }}
                      disabled={sameperson}
                    >
                      Cambiar Rol
                    </Button>
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
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      style={{
                        border: modifiedFields.email ? "3px solid #00ff66" : "",
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
            {/* <div className="d-flex justify-content-end mt-3">
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
                    variant="secondary"
                    className="btn btn-secondary custom-btn-gray-outline"
                    onClick={handleCancelEdit}
                  >
                    Cancelar Edición
                  </Button>
                </>
              )}
            </div> */}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {changes ? (
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
                variant="success"
                className="btn btn-success custom-btn-green-outline mx-2"
                onClick={handleSaveChanges}
              >
                Guardar cambios
              </Button>

              <Button
                variant="secondary"
                className="btn btn-secondary custom-btn-gray-outline"
                onClick={handleCancelEdit}
              >
                Cancelar Edición
              </Button>
            </>
          ) : (
            // <Button
            //   className="btn btn-primary custom-btn-primary-outline"
            //   variant="primary"
            //   // onClick={}
            // >
            //   Aceptar
            // </Button>

            <Button
              className="btn btn-secondary custom-btn-gray-outline"
              variant="secondary"
              onClick={handleClose}
            >
              Cerrar
            </Button>
          )}
          {/* <Button
            className="btn btn-secondary custom-btn-gray-outline"
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button> */}
        </Modal.Footer>
      </Modal>

      {/* modal cambios de info de usuario */}

      <Modal
        show={showModalCambios}
        onHide={handleCloseModalCambios}
        centered
        backdrop="static"
        dialogClassName="modal-innermost"
      >
        <Modal.Header closeButton>
          <Modal.Title>¡Confirmación!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Está seguro de continuar con los siguientes cambios:</div>
          <div className="mt-2">
            <ul>
              {Object.entries(changesState).map(([key, value]) => (
                <li key={key}>
                  <Alert variant="success">
                    <strong>{key}</strong>: {value}
                  </Alert>
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
            onClick={handleAccepCambios}
            disabled={loadingModal}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            className="btn btn-secondary custom-btn-gray-outline"
            onClick={handleCancelCambios}
            disabled={loadingModal}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal editar rol */}

      <Modal
        show={showEditarRol}
        onHide={() => setShowEditarRol(false)}
        centered
        backdrop="static"
        dialogClassName="modal-innermost" // Aplica clase personalizada aquí
      >
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <b>Rol:</b>
            </Col>

            <Col>
              <div>
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
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary custom-btn-primary-outline"
            variant="primary"
            onClick={handleAccept}
          >
            Cambiar
          </Button>
          <Button
            className="btn btn-secondary custom-btn-gray-outline"
            variant="secondary"
            onClick={() => setShowEditarRol(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* modal de respuesta servidor para user/upate */}
      <Modal
        show={showResponseModalUpdate}
        onHide={() => setShowResponseModalUpdate(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn btn-secondary custom-btn-gray-outline"
            onClick={handleOnClickRS}
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
          <div>{responseMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary custom-btn-primary-outline"
            variant="primary"
            onClick={handleResponseModal}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

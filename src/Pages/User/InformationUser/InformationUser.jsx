import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import "./InformationUser.css";
import { useState, useEffect } from "react";

export default function InformationUser() {
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [changes, setChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [show, setShow] = useState(false);
  const [changesState, setChangesState] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});
  const [initialFormData, setInitialFormData] = useState(null);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [showCambiar, setShowCambiar] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const URL = import.meta.env.VITE_REACT_API_URL;
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    Nombre: "",
    "Segundo Nombre": "",
    "Apellido Paterno": "",
    "Apellido Materno": "",
    nombreUsuario: "",
    "Correo Principal": "",
    Rol: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const originalData1String = localStorage.getItem("userInformation");
      if (originalData1String) {
        const originalData1 = JSON.parse(originalData1String);

        const updatedData = {
          Nombre: originalData1.name.split(" ")[0],
          "Segundo Nombre": originalData1.name.split(" ")[1] || "",
          "Apellido Paterno": originalData1.lastname.split(" ")[0],
          "Apellido Materno": originalData1.lastname.split(" ")[1] || "",
          nombreUsuario: originalData1.user_name,
          "Correo Principal": originalData1.email,
          Rol: originalData1.roles[0],
        };

        setFormData(updatedData);
        setInitialFormData(updatedData);

        if (updatedData.Rol === "DOCENTE") {
          const endpoint = `${URL}/teacher-subjects/teacher/${originalData1.person_id}`;
          try {
            const response = await fetch(endpoint, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            const data = await response.json();
            setSubject(data);
          } catch (error) {
            console.error("Error al realizar la solicitud:", error);
          }
        }

        setNotificationSettings({
          "Correo Principal": updatedData["Correo Principal"],
        });
      } else {
        console.log("No data found in localStorage.");
      }
    };

    fetchData();
  }, []);

  const [notificationSettings, setNotificationSettings] = useState({
    "Correo Principal": formData["Correo Principal"],
  });

  const handleCambiar = () => {
    setShowCambiar(true);
  };

  const togglePasswordVisibilityActual = () => {
    setShowPasswordActual(!showPasswordActual);
  };

  const togglePasswordVisibilityNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  const handleCloseCambiar = () => {
    setContrasenaActual("");
    setContrasenaNueva("");
    setShowPasswordActual(false);
    setShowPasswordNew(false);
    setShowAlert(false);
    setShowCambiar(false);
  };

  const handleSendCambiar = async () => {
    const passwords = {
      current_password: contrasenaActual,
      new_password: contrasenaNueva,
    };

    try {
      const response = await fetch(URL + "URL_DEL_SERVIDOR", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const result = await response.json();

      if (!response.ok) {
        setAlertMessage(
          result.message || "Error al validar la contraseña actual."
        );
        setShowAlert(true);
      } else {
        setSuccessMessage(result.message || "Contraseña cambiada con éxito.");
        setShowSuccessModal(true);
        handleCloseCambiar();
      }
    } catch (error) {
      setAlertMessage("Error de conexión con el servidor.");
      setShowAlert(true);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleCancelEdit = () => {
    setFormData({ ...initialFormData });
    setNotificationSettings({
      "Correo Principal": initialFormData["Correo Principal"],
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setModifiedFields((prevModifiedFields) => ({
      ...prevModifiedFields,
      [name]: value !== initialFormData[name],
    }));
  };

  const handleSaveChanges = () => {
    setIsLoading(true);

    const detectedChanges = getChanges();

    setChangesState(detectedChanges);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setShow(true);
  };

  const getChanges = () => {
    const changes = {};

    const fullName = [formData.Nombre, formData["Segundo Nombre"]]
      .filter(Boolean)
      .join(" ");
    const originalFullName = [
      initialFormData.Nombre,
      initialFormData["Segundo Nombre"],
    ]
      .filter(Boolean)
      .join(" ");

    if (fullName !== originalFullName) {
      changes.name = fullName;
    }

    if (formData["Apellido Paterno"] !== initialFormData["Apellido Paterno"]) {
      changes.last_name = formData["Apellido Paterno"];
    }

    if (formData["Apellido Materno"] !== initialFormData["Apellido Materno"]) {
      changes.last_name = changes.last_name
        ? `${changes.last_name} ${formData["Apellido Materno"]}`
        : formData["Apellido Materno"];
    }

    if (formData.nombreUsuario !== initialFormData.nombreUsuario) {
      changes.user_name = formData.nombreUsuario;
    }

    if (formData["Correo Principal"] !== initialFormData["Correo Principal"]) {
      changes.email = formData["Correo Principal"];
    }

    return changes;
  };

  const updateUser = async (changes) => {
    try {
      const response = await fetch(URL + "users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });
      const data = await response.json();

      if (!response.ok) {
        setModalContent({
          title: "Error",
          message:
            data.message || "Error al actualizar la información del usuario.",
        });
      } else {
        setModalContent({
          title: "Éxito",
          message:
            data.message || "Información del usuario actualizada con éxito.",
        });
      }
    } catch (error) {
      setModalContent({
        title: "Error",
        message: "Error de conexión con el servidor.",
      });
    }
    setShowResponseModal(true);
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
                <Button onClick={handleCambiar}>Cambiar Contraseña</Button>
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
            {formData.Rol === "DOCENTE" && (
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
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            )}
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
                type="button"
                onClick={handleSaveChanges}
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

      {showSuccessModal && (
        <Modal show={showSuccessModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Éxito</Modal.Title>
          </Modal.Header>
          <Modal.Body>{successMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSuccessModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* modal cambiar contraseña */}

      <Modal show={showCambiar} onHide={handleCloseCambiar} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}
          <Row className="mb-4">
            <Col style={{ position: "relative" }}>
              <Form.Control
                className="text-truncate"
                type={showPasswordActual ? "text" : "password"}
                name="contrasenaActual"
                placeholder="Contraseña Actual"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
              />
              <i
                className={showPasswordActual ? "bi bi-eye-slash" : "bi bi-eye"}
                onClick={togglePasswordVisibilityActual}
                style={{
                  position: "absolute",
                  right: "25px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              ></i>
            </Col>
          </Row>

          <Row>
            <Col style={{ position: "relative" }}>
              <Form.Control
                className="text-truncate"
                type={showPasswordNew ? "text" : "password"}
                name="contrasenaNueva"
                placeholder="Contraseña Nueva"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
              />
              <i
                className={showPasswordNew ? "bi bi-eye-slash" : "bi bi-eye"}
                onClick={togglePasswordVisibilityNew}
                style={{
                  position: "absolute",
                  right: "25px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              ></i>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSendCambiar}>
            Cambiar
          </Button>
          <Button variant="secondary" onClick={handleCloseCambiar}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Éxito */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">{successMessage}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

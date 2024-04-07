import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ModalRejectRequest.css";

function ModalRejectRequest() {
  const [show, setShow] = useState(false);
  const [showInnerModal, setShowInnerModal] = useState(false);
  const [sugerencia, setSugerencia] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  //data of form
  const [formData, setFormData] = useState({
    motivo: "",
    mensajeSugerencia: "",
    sugerencia: "",
  });

  //Suggestion list examples
  let suggestions = [];
  suggestions.push("Sugerencia 1");
  suggestions.push("Sugerencia 2");
  suggestions.push("Sugerencia 3");
  suggestions.push("Sugerencia 4");
  suggestions.push("Sugerencia 5");
  suggestions.push("Sugerencia 6");
  suggestions.push("Sugerencia 7");
  suggestions.push("Sugerencia 8");
  suggestions.push("Sugerencia 9");
  suggestions.push("Sugerencia 10");
  suggestions.push("Sugerencia 11");
  suggestions.push("Sugerencia 12");

  //control MODAL 1de mostrados de los botones principales(rechazar solicitud y rechazar)
  //rechazar
  const handleClose = () => {
    setShow(false);
    console.log(" boton Rechazar");
  };
  //rechazat solicitud
  const handleShow = () => {
    setShow(true);
    console.log("boton rechazar solicitud");
  };

  //sugerir
  const handleSugerir = () => {
    setShowInnerModal(true);
    console.log("Boton sugerir");
  };

  //control MODAL2
  //atras
  const handleInnerModalClose = () => {
    setShowInnerModal(false);
    setSugerencia(false);
    setFormData({ motivo: "", mensajeSugerencia: "", sugerencia: "" });
    console.log("atras");
  };

  //enviar
  const handleEnviar = () => {
    setShow(false);
    setShowInnerModal(false);
    setSugerencia(false);
    console.log(formData);
    !sugerencia ? console.log(formData) : console.log(formData);
    setFormData({ motivo: "", mensajeSugerencia: "", sugerencia: "" });
  };

  //obtener datos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sugerencia") {
      setFormData({
        ...formData,
        sugerencia: value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //BOTON generar sugerencia
  const handleSugerencia = () => {
    setSugerencia(!sugerencia);
    console.log("Generando las sugerencias");
  };

  //sugerencias selecionada
  const handleItemClick = (index) => {
    setSelectedItem(index);
    setSelectedSuggestion(suggestions[index]);
    console.log("Escogi esta opcion" + suggestions[index]);
  };

  // Función de validación Reason and Suggestion
  const validateInput = (value) => {
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
    if (value && !regex.test(value)) {
      return "No se acepta caracteres especiales";
    }
    return null;
  };

  return (
    <>
      <div>
        <Button className="mr-5">Acepted</Button>
        <Button className="ml-15" variant="primary" onClick={handleShow}>
          Rechazar Solicitud
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>Esta seguro de rechazar la solicitud!.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Aceptar y Rechazar
          </Button>
          {/* <Button variant="primary" onClick={handleSugerir}>
            Sugerir
          </Button> */}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showInnerModal}
        onHide={handleInnerModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Suggestion of <span class="text-capitalize">Ambient</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEnviar}>
            <Form.Group className="mb-3">
              <Form.Label>Motivo de rechazo</Form.Label>
              <Form.Control
                type="input"
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                maxLength={50}
                isInvalid={!!validateInput(formData.motivo)}
              />
              <Form.Control.Feedback type="invalid">
                {validateInput(formData.motivo)}
              </Form.Control.Feedback>
              <Form.Label>Sugerencia</Form.Label>
              <Form.Control
                as="textarea"
                id="mensajeSugerencia"
                name="mensajeSugerencia"
                value={formData.mensajeSugerencia}
                onChange={handleChange}
                rows={2}
                maxLength={60}
                placeholder="Aqui ecriba una sugerencia"
                isInvalid={!!validateInput(formData.mensajeSugerencia)}
              />
              <Form.Control.Feedback type="invalid">
                {validateInput(formData.mensajeSugerencia)}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Button onClick={handleSugerencia}>
                {sugerencia ? "Generar sugerencia" : "Generar sugerencia"}
              </Button>
              <Collapse in={sugerencia} className="mt-3">
                <div className="scrollable-list">
                  <ul className="list-group rounded">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className={`list-group-item ${
                          selectedItem === index ? "active" : ""
                        }`}
                        onClick={() => {
                          handleItemClick(index);
                          handleChange({
                            target: {
                              name: "sugerencia",
                              value: suggestion,
                            },
                          });
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </Collapse>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInnerModalClose}>
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            class="btn btn-primary"
            onClick={handleEnviar}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalRejectRequest;

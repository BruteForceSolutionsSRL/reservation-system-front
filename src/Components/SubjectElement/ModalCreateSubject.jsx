import { Alert, Modal } from "react-bootstrap";
import { useFetchService } from "../Hooks/useFetchService";
import { useEffect, useState } from "react";
import Select from "react-select";

export default function ModalCreateSubject({ show, setShow }) {
  const { getFetch, postFetch } = useFetchService();
  const [subjectName, setSubjectName] = useState("");
  const [subjectCodSis, setSubjectCodSis] = useState("");
  const [departamentSelected, setDepartamentSelected] = useState([]);
  const [levelSelected, setLevelSelected] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [depOptions, setDepOptions] = useState([]);

  const [studyPlansOptions, setStudyPlansOptions] = useState([]);

  const [message, setMessage] = useState({});

  const levelsOptions = [
    {
      label: "A",
      value: 1,
    },
    {
      label: "B",
      value: 2,
    },
    {
      label: "C",
      value: 3,
    },
    {
      label: "D",
      value: 4,
    },
    {
      label: "E",
      value: 5,
    },
    {
      label: "F",
      value: 6,
    },
    {
      label: "G",
      value: 7,
    },
    {
      label: "H",
      value: 8,
    },
    {
      label: "I",
      value: 9,
    },
  ];

  useEffect(() => {
    Promise.all([fetchDepartments()]);
  }, []);

  const handleClose = () => {
    setShow(false);
    setMessage({});
  };

  const createSubject = async () => {
    // const studyPlanIds = studyPlans.map((s) => s.value);
    const studyPlanList = [studyPlans.value];
    studyPlanList.push();
    const levelsList = [];
    levelsList.push(levelSelected.label);
    const subject = {
      cod_sis: subjectCodSis,
      name: subjectName,
      department_id: departamentSelected.value.department_id,
      study_plan_ids: studyPlanList,
      levels: levelsList,
    };
    const { status, data } = await postFetch(
      "university-subjects/store",
      subject
    );
    if (status >= 200 && status < 300) {
      initialState();
      setMessage({ type: "success", message: data.message });
    } else {
      setMessage({ type: "danger", message: data.message });
    }
  };

  const initialState = () => {
    setSubjectName("");
    setSubjectCodSis("");
    setDepartamentSelected([]);
    setLevelSelected([]);
    setStudyPlans([]);
  };

  const fetchDepartments = async () => {
    const { status, data } = await getFetch("departments");
    if (status >= 200 && status < 300) {
      setDepartments(data);
      formatDepOptions(data);
    } else {
      setDepartments([]);
    }
  };

  const formatDepOptions = (list) => {
    let formatedOptiones = list.map((d) => {
      return { label: d.name, value: d };
    });
    setDepOptions(formatedOptiones);
  };

  const handleChangeSubjectName = (event) => {
    const { value } = event.target;
    setSubjectName(value);
  };

  const handleChangeSubjectCodSis = (event) => {
    const { value } = event.target;
    setSubjectCodSis(value);
  };

  const handleChangeDepartamentSelected = (event) => {
    setDepartamentSelected(event);
    let deptsIds = [];
    deptsIds.push(event.value.department_id);
    fetchStudyPlansPerDepartments(deptsIds);
    // Parece que el endpoint para crear materia no permite mandar un array al department_id :c
    // const departmentsIds = event.map((d) => d.value.department_id);
    // fetchStudyPlansPerDepartments(departmentsIds);
  };

  const handleChangeLevelSelected = (event) => {
    setLevelSelected(event);
  };

  const handleChangeStudyPlans = (event) => {
    setStudyPlans(event);
  };

  const fetchStudyPlansPerDepartments = async (departments_ids) => {
    const { status, data } = await postFetch(
      "study-plans/filter-by-departments",
      { department_ids: departments_ids }
    );
    if (status >= 200 && status < 300) {
      formatStudyPlansOptions(data);
    }
  };

  const formatStudyPlansOptions = (list) => {
    const stList = list.map((st) => {
      return {
        label: st.name,
        value: st.study_plan_id,
      };
    });
    setStudyPlansOptions(stList);
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear materia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-2">
            <div className="d-flex align-items-center my-2">
              <b>NOMBRE: </b>
              <input
                type="text"
                className="ms-2 form-control"
                value={subjectName}
                onChange={handleChangeSubjectName}
              />
            </div>
            <div className="d-flex align-items-center my-2">
              <b>CODIGO: </b>
              <input
                type="text"
                className="ms-2 form-control"
                value={subjectCodSis}
                onChange={handleChangeSubjectCodSis}
              />
            </div>
            <div className="d-flex align-items-center my-2">
              <b className="pe-2">DEPARTAMENTO: </b>
              <Select
                className="flex-fill"
                options={depOptions}
                onChange={handleChangeDepartamentSelected}
                value={departamentSelected}
                noOptionsMessage={() =>
                  "Todas las opciones fueron seleccionadas"
                }
                placeholder="Seleccione un departamento"
                closeMenuOnSelect={false}
              />
            </div>
            <div className="d-flex align-items-center my-2">
              <b className="pe-2">CARRERA: </b>
              <Select
                className="flex-fill"
                options={studyPlansOptions}
                onChange={handleChangeStudyPlans}
                value={studyPlans}
                noOptionsMessage={() =>
                  "Todas las opciones fueron seleccionadas"
                }
                placeholder="Seleccione la carrera."
                closeMenuOnSelect={false}
              />
            </div>
            <div className="d-flex align-items-center my-2">
              <b className="pe-2">NIVEL: </b>
              <Select
                className="flex-fill"
                options={levelsOptions}
                onChange={handleChangeLevelSelected}
                value={levelSelected}
                noOptionsMessage={() =>
                  "Todas las opciones fueron seleccionadas"
                }
                placeholder="Seleccione el nivel de la materia."
                closeMenuOnSelect={false}
              />
            </div>
            {message.type && (
              <Alert variant={message.type}>{message.message}</Alert>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-success"
            onClick={createSubject}
            disabled={
              subjectName === "" &&
              subjectCodSis === "" &&
              departamentSelected.length === 0 &&
              levelSelected.length === 0 &&
              studyPlans.length === 0
            }
          >
            Crear
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

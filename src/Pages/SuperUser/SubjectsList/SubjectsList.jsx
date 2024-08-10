import { useEffect, useState } from "react";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import SubjectElement from "../../../Components/SubjectElement/SubjectElement";
import ModalCreateSubject from "../../../Components/SubjectElement/ModalCreateSubject";
import { useFetchService } from "../../../Components/Hooks/useFetchService";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { Toast, ToastContainer } from "react-bootstrap";

export default function SubjectsList() {
  const [searchValue, setSearchValue] = useState("");
  const [resultList, setResultList] = useState([]);
  const [showNewSubjectModal, setShowNewSubjectModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFetch, deleteFetch } = useFetchService();
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState({});

  useEffect(() => {
    fetchSubjects().finally(() => setLoading(false));
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    const { status, data } = await getFetch("university-subjects");
    if ((status >= 200) & (status < 300)) {
      setSubjects(data);
      setResultList(data);
    } else {
      setSubjects([]);
    }
  };

  const deleteSubject = async (university_subject_id, subjectName) => {
    const { status, data } = await deleteFetch(
      `university-subjects/${university_subject_id}`
    );
    if (status >= 200 && status < 300) {
      const newToastBody = {
        title: "Materia eliminada.",
        body: `Se eliminó la materia ${subjectName}`,
      };
      setToastBody(newToastBody);
      setShowToast(true);
      fetchSubjects().finally(() => setLoading(false));
    } else {
      const newToastBody = {
        title: "Error al eliminar",
        body:
          data.message ??
          "No se pudo eliminar la materia, intentelo nuevamente mas tarde",
      };
      setToastBody(newToastBody);
      setShowToast(true);
    }
  };

  const search = (searchParam) => {
    if (searchParam === "") {
      return subjects;
    } else {
      return subjects.filter(
        (subj) =>
          subj.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          subj.department_name.toLowerCase().includes(searchParam.toLowerCase())
      );
    }
  };

  const handleChangeSearchValue = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    const list = search(value);
    setResultList(list);
  };

  const handleCloseToast = () => setShowToast(false);

  return (
    <div>
      <div className="shadow rounded p-3 mx-2 position-sticky top-0 bg-white">
        <h1 className="text-center">Materias</h1>
        <div className="d-flex">
          <div className="align-self-center flex-fill">
            <SearchBar
              value={searchValue}
              onChange={handleChangeSearchValue}
              onPaste={(e) => e.preventDefault()}
            />
          </div>
          <div className="align-self-center d-flex justify-content-end">
            <button
              className="btn"
              onClick={() => setShowNewSubjectModal(true)}
            >
              <i className="bi bi-plus-circle fs-3 d-block"></i>
              <span>Nuevo</span>
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        {loading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {resultList.map((subject) => {
              return (
                <div key={subject.university_subject_id}>
                  <SubjectElement subject={subject} onClick={deleteSubject} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <ModalCreateSubject
        show={showNewSubjectModal}
        setShow={setShowNewSubjectModal}
      />

      <ToastContainer
        className="p-3"
        position={"top-end"}
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={handleCloseToast}
          show={showToast}
          delay={3000}
          bg={toastBody.title === "Materia eliminada." ? "danger" : "warning"}
          autohide
        >
          <Toast.Body>{toastBody.body}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

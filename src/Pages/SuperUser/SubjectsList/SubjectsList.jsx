import { useEffect, useState } from "react";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import SubjectElement from "../../../Components/SubjectElement/SubjectElement";
import ModalCreateSubject from "../../../Components/SubjectElement/ModalCreateSubject";
import { useFetchService } from "../../../Components/Hooks/useFetchService";

export default function SubjectsList() {
  const [searchValue, setSearchValue] = useState("");
  const [showNewSubjectModal, setShowNewSubjectModal] = useState(false);
  const { getFetch } = useFetchService();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { status, data } = await getFetch("university-subjects");
    console.log(status, data);
    // Los datos no me los mandan como necesito, me mandan solamente el "name" y el "university_subject_id", necesito mas datos :/
  };

  return (
    <div>
      <div className="shadow rounded p-3 mx-2 position-sticky top-0 bg-white">
        <h1 className="text-center">MATERIAS</h1>
        <div className="d-flex">
          <div className="align-self-center flex-fill">
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
        <SubjectElement />
      </div>
      <ModalCreateSubject
        show={showNewSubjectModal}
        setShow={setShowNewSubjectModal}
      />
    </div>
  );
}

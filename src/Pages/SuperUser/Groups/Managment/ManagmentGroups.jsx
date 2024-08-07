import { useEffect, useState } from "react";
import GroupsList from "../../../../Components/Groups/GroupsList/GroupsList";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import NewGroup from "../../../../Components/Groups/NewGroup";
import { useFetchService } from "../../../../Components/Hooks/useFetchService";
import LoadingSpinner from "../../../../Components/LoadingSpinner/LoadingSpinner";

export default function ManagmentGroups() {
  const { getFetch } = useFetchService();
  const [groupsList, setGroupsList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllGroupsByFacultyAndCurrentAcademicPeriod()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const search = (value) => {
    if (value === "") {
      setResultList(groupsList);
    } else {
      let valueLC = value.toLowerCase();
      let newList = groupsList.filter(
        (group) =>
          group.subject_name.toLowerCase().includes(valueLC) ||
          group.group_number.toLowerCase().includes(valueLC) ||
          group.class_schedules.some((schedule) =>
            schedule.classroom.name.toLowerCase().includes(valueLC)
          )
      );
      setResultList(newList);
    }
  };

  const handleChangeSearchValue = (event) => {
    const { value } = event.target;
    search(value);
    setSearchValue(value);
  };

  const getAllGroupsByFacultyAndCurrentAcademicPeriod = async () => {
    try {
      const faculties = await getFetch(`faculties`);
      if (faculties.status >= 200 && faculties.status < 300) {
        const academicPeriods = [];
        for (let i = 0; i < faculties.data.length; i++) {
          const facultyId = faculties.data[i].faculty_id;
          const period = await getFetch(
            `academic-periods/actual-period?faculty_id=${facultyId}`
          );
          if (period.status >= 200 && period.status < 300) {
            academicPeriods.push(period.data.academic_period_id);
          }
        }
        if (academicPeriods.length > 0) {
          let allGroups = [];
          for (let i = 0; i < academicPeriods.length; i++) {
            const academicPeriod = academicPeriods[i];
            const groups = await fetchGroups(academicPeriod);
            allGroups = [...allGroups, ...groups];
          }
          setGroupsList(allGroups);
          setResultList(allGroups);
        }
      } else {
        setGroupsList([]);
        setResultList([]);
      }
    } catch (err) {
      console.error(err);
      setGroupsList([]);
      setResultList([]);
    }
  };
  const fetchGroups = async (academicPeriod) => {
    const { status, data } = await getFetch(
      `teacher-subjects/${academicPeriod}`
    );
    if (status >= 200 && status < 300) {
      return data;
    } else {
      return [];
    }
  };

  return (
    <>
      <div className="mx-2 p-3 shadow rounded position-sticky top-0 bg-white">
        <h1 className="text-center">Lista de grupos</h1>
        <div className="d-flex">
          <div className="align-self-center flex-fill">
            <SearchBar value={searchValue} onChange={handleChangeSearchValue} />
          </div>
          <div className="align-self-center d-flex justify-content-end">
            <button className="btn" onClick={() => setShowNewGroupModal(true)}>
              <i className="bi bi-plus-circle fs-3 d-block"></i>
              <span>Nuevo</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-2">
        {loading ? (
          <div
            className="d-flex aling-items-center justify-content-center"
            style={{ height: "30rem" }}
          >
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {groupsList.length < 1 ? (
              <div
                className="d-flex aling-items-center justify-content-center"
                style={{ height: "30rem" }}
              >
                <h3>No existen grupos por el momento.</h3>
              </div>
            ) : (
              <>
                {resultList.length < 1 ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "25rem" }}
                  >
                    <h3 className="text-center">
                      No se encontraron resultados.
                    </h3>
                  </div>
                ) : (
                  <GroupsList groupsList={resultList} />
                )}
              </>
            )}
          </>
        )}
      </div>
      <NewGroup
        show={showNewGroupModal}
        setShow={(value) => setShowNewGroupModal(value)}
      />
    </>
  );
}

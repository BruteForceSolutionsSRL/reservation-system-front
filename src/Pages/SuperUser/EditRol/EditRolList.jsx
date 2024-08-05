import { useEffect, useState } from "react";
import { getUsers } from "../../../services/teachers";
import { Spinner } from "react-bootstrap";
import EditRol from "./EditRol";
import SearchBar from "../../../Components/SearchBar/SearchBar";

export default function EditRolList() {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    getUsersList();
  }, []);

  const search = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    if (value === "") {
      setResultList(teachers);
    } else {
      const result = teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(value.toLowerCase()) ||
          t.fullname.toLowerCase().includes(value.toLowerCase()) ||
          t.user_name.toLowerCase().includes(value.toLowerCase()) ||
          t.roles.some((r) => r.toLowerCase().includes(value.toLowerCase()))
      );
      setResultList(result);
    }
  };

  const getUsersList = async () => {
    let { state, data } = await getUsers().catch((err) => console.error(err));

    console.log("algun data", data);
    setTeachers(data);
    setResultList(data);
    // if (data) {
    //   const teachersWithSubjects = await Promise.all(
    //     data.map(async (teacher) => {
    //       const subjects = await getSubjectsPerTeacher(teacher.person_id);
    //       return { ...teacher, subjects };
    //     })
    //   );
    //   setTeachers(teachersWithSubjects);
    // }
    setLoading(false);
  };

  const getSubjectsPerTeacher = async (person_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/api/teacher-subjects/teacher/${person_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch subjects");
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  return (
    <div className="">
      <div className="mx-2 my-3 p-3 rounded shadow position-sticky top-0 bg-white">
        <h1 className="text-center">Lista de Usuarios</h1>
        <SearchBar
          value={searchValue}
          onChange={search}
          onPaste={(e) => e.preventDefault()}
        />
      </div>
      <div className="container">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {resultList.map((each) => (
              <div key={each.person_id}>
                <EditRol {...each} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

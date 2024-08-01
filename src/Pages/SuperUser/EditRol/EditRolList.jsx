// import { useEffect, useState } from "react";
// import { getTeachers } from "../../../services/teachers";
// import { Spinner } from "react-bootstrap";
// import EditRol from "./EditRol";

// export default function EditRolList() {
//   const [loading, setLoading] = useState(true);
//   const [teachers, setTeachers] = useState([]);

//   useEffect(() => {
//     getTeachersList();
//   }, []);

//   const getTeachersList = async () => {
//     let { state, data } = await getTeachers().catch((err) =>
//       console.error(err)
//     );

//     if (data) {
//       const teachersWithSubjects = await Promise.all(
//         data.map(async (teacher) => {
//           const subjects = await getSubjectsPerTeacher(teacher.person_id);
//           return { ...teacher, subjects };
//         })
//       );
//       setTeachers(teachersWithSubjects);
//     }
//     setLoading(false);
//   };

//   const getSubjectsPerTeacher = async (person_id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/teacher-subjects/teacher/${person_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.ok) {
//         const data = await response.json();
//         return data;
//       } else {
//         console.error("Failed to fetch subjects");
//         return [];
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       return [];
//     }
//   };

//   return (
//     <div className="container mt-2">
//       <h1 className="text-center">Lista de Usuarios</h1>
//       <hr />
//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="secondary" role="status">
//             <span className="visually-hidden">Cargando...</span>
//           </Spinner>
//         </div>
//       ) : (
//         <>
//           {teachers.map((each) => (
//             <div key={each.person_id}>
//               {/* <EditRol {...each} subjects={each.subjects} role={role} /> */}
//               <EditRol {...each} />
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getTeachers } from "../../../services/teachers";
import { Spinner } from "react-bootstrap";
import EditRol from "./EditRol";

export default function EditRolList() {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    getTeachersList();
  }, []);

  const getTeachersList = async () => {
    let { state, data } = await getTeachers().catch((err) =>
      console.error(err)
    );

    if (data) {
      const teachersWithSubjects = await Promise.all(
        data.map(async (teacher) => {
          const subjects = await getSubjectsPerTeacher(teacher.person_id);
          return { ...teacher, subjects };
        })
      );
      setTeachers(teachersWithSubjects);
    }

    // Adding a sample teacher for testing purposes
    const sampleTeacher = {
      person_email: "docente@example.com",
      person_fullname: "Docente Ejemplo",
      person_id: 456789,
      person_lastname: "Ejemplo",
      person_name: "Docente",
      subjects: [
        { subject_id: 101, subject_name: "Matemáticas" },
        { subject_id: 102, subject_name: "Ciencias" },
      ],
      roles: ["ENCARGADO"], // Example role
    };

    setTeachers((prevTeachers) => [...prevTeachers, sampleTeacher]);
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
    <div className="container mt-2">
      <h1 className="text-center">Lista de Usuarios</h1>
      <hr />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {teachers.map((each) => (
            <div key={each.person_id}>
              <EditRol {...each} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

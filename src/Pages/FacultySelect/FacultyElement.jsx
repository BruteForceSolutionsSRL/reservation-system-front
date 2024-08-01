import { useNavigate } from "react-router-dom";
import { useFetchService } from "../../Components/Hooks/useFetchService";
import "./FacultyElement.css";
import { useAuth } from "../../contexts/AuthProvider";
export default function FacultyElement(props) {
  const { faculty_id, name } = props;
  const { login } = useAuth();
  const { postFetch } = useFetchService();
  const navigate = useNavigate();

  const handleClickFaculty = () => {
    loginUserWithFaculty();
  };

  const loginUserWithFaculty = async () => {
    const { status, data } = await postFetch(
      "auth/complete/login",
      { faculty_id: faculty_id },
      new AbortController()
    );
    if (status >= 200 && status < 300) {
      localStorage.clear();
      const { access_token, person, refresh_token } = data;
      if (person.roles[0] === "DOCENTE") {
        login({ role: "user" });
        navigate("/user/home");
      } else if (person.roles[0] === "ENCARGADO") {
        login({ role: "superuser" });
        navigate("/superuser/home");
      }
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("userInformation", JSON.stringify(person));
      localStorage.setItem("faculty", faculty_id);
    } else if (
      (status >= 300 && status < 400) ||
      (status >= 400 && status < 500)
    ) {
      // Mostrar mensaje de error correspondiente.
    } else {
      // Error inesperado
    }
  };

  return (
    <div
      className="border border-dark rounded p-3 hoverElement"
      onClick={handleClickFaculty}
    >
      {name} 🎓
    </div>
  );
}

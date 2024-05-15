import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const userSession = () => {
    sessionStorage.setItem("userloged", "user");
    sessionStorage.setItem("userInformation", {
      name: "MAGDA LENA PEETERS ILONAA",
      teacher_id: 2,
    });
  };
  const superUserSession = () => {
    sessionStorage.setItem("userloged", "superuser");
    sessionStorage.setItem("userInformation", {
      name: "Juanito Perez ",
      teacher_id: 2,
    });
  };
  return (
    <div className="bg text-center">
      <h1>This is a landing page</h1>
      <div>
        <div>
          <Link to="/user/home" onClick={userSession}>
            Ingresar como usuario
          </Link>
        </div>
        <div>
          <Link to="/superuser/home" onClick={superUserSession}>
            Ingresar como administrador
          </Link>
        </div>
      </div>
    </div>
  );
}

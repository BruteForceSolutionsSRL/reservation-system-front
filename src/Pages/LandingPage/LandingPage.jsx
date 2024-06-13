import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const userSession = () => {
    const user = {
      name: "MAGDA LENA PEETERS ILONAA",
      teacher_id: 2,
    };
    sessionStorage.setItem("userloged", "user");
    sessionStorage.setItem("userInformation", JSON.stringify(user));
  };
  const superUserSession = () => {
    const user = {
      name: "Juanito Perez ",
      teacher_id: 20,
    };
    sessionStorage.setItem("userloged", "superuser");
    sessionStorage.setItem("userInformation", JSON.stringify(user));
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

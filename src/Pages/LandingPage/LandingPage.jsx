import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="bg text-center">
      <h1>This is a landing page</h1>
      <div>
        <div>
          <Link to="/user">Ingresar como usuario</Link>
        </div>
        <div>
          <Link to="/superuser">Ingresar como administrador</Link>
        </div>
      </div>
    </div>
  );
}

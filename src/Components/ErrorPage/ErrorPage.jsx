import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div>
      <h1>Oops!</h1>
      <p>
        Ocurrio un error, la direccion ingresada no puede encontrarse {`:(`}
      </p>
      <Link to="home">Pagina principal</Link>
    </div>
  );
}

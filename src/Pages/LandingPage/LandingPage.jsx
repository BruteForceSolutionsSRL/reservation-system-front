import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <h1>This is a landing page</h1>
      <div>
        <Link to="/user">Login like a user</Link>
      </div>
      <div>
        <Link to="/superuser">Login like a superuser</Link>
      </div>
    </div>
  );
}

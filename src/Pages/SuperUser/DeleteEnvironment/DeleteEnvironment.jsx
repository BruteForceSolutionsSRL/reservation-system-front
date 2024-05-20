import { useState } from "react";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import EnvironmentToDelete from "./EnvironmentToDelete";
import { environmentsProvisional } from "./DataProvisional";

export default function DeleteEnvironment() {
  const [environments, setEnvironments] = useState(environmentsProvisional);
  // const [environments, setEnvironments] = useState([]);
  return (
    <div className="container">
      <h1 className="text-center">Eliminar ambiente</h1>
      <SearchBar />
      <hr />
      {environments?.map((each) => {
        return (
          <div key={each.id}>
            <EnvironmentToDelete {...each} />
          </div>
        );
      })}
    </div>
  );
}

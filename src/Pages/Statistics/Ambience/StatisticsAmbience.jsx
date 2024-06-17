import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./StatisticsAmbience.css";
import StatisticsElement from "./StatisticsElement";
import { getClassrooms } from "../../../services/statistics";
import SearchBar from "../../../Components/SearchBar/SearchBar.jsx";
import { searchByClassroomsForStatistics } from "../../../utils/searchEnvironments.js";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsAmbience() {
  const [elementsList, setElementList] = useState([]);
  const [show, setShow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchResultsList, setSearchResultsList] = useState([]);
  const [msgNoResults, setMsgNoResults] = useState("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setSearchResultsList(elementsList);
      setMsgNoResults("");
      setShow(true);
    } else {
      const results = searchByClassroomsForStatistics(
        elementsList,
        searchValue
      );
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados para esta busqueda.");
      } else {
        setMsgNoResults("");
      }
      setSearchResultsList(results);
    }
  }, [searchValue]);

  const fetchClassrooms = async () => {
    try {
      let classrooms = await getClassrooms();
      setElementList(classrooms.data);
    } catch (error) {
      console.error("Error", error);
      setElementList([]);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-center mb-4">Estadísticas de ambiente</h1>
      </div>
      <div className="search-cotainer mb-4">
        <SearchBar
          value={searchValue}
          onChange={(event) => {
            const regex = /^[a-zA-Z0-9\s]*$/;
            if (regex.test(event.target.value) || event.target.value === "") {
              setSearchValue(event.target.value.toUpperCase());
            }
            setShow(false);
          }}
          onPaste={(e) => e.preventDefault()}
        />
      </div>
      <div className="pt-3">
        {show ? (
          <div className="text-center">
            <h2>Realice una busqueda para ver resultados de ambientes.</h2>
          </div>
        ) : (
          <>
            {searchResultsList.length === 0 ? (
              <div className="text-center">
                <h2>{msgNoResults}</h2>
              </div>
            ) : (
              <>
                {searchResultsList.map((each) => {
                  return (
                    <div key={each.classroom_id}>
                      <StatisticsElement {...each} />
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

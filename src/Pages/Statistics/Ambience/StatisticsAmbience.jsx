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
} from "chart.js"; // npm install --save chart.js react-chartjs-2

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./StatisticsAmbience.css";
import StatisticsElement from "./StatisticsElement";
import { getClassrooms } from "../../../services/statistics";

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
  const [hardCode, setHardCode] = useState(true);

  useEffect(() => {
    fetchClassrooms();
  }, []);

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
        <input
          type="search"
          placeholder="Buscar"
          onChange={() => setHardCode(false)}
        />
      </div>
      <div className="pt-3">
        {hardCode ? (
          <>
            <b>Busque algo</b>
          </>
        ) : (
          <>
            {elementsList.map((each) => {
              return (
                <div key={each.classroom_id}>
                  {/* <StatisticsElement {...each} optionsLine={optionsLine} /> */}
                  <StatisticsElement {...each} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

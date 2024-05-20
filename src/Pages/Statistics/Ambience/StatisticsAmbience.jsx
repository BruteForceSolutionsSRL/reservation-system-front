// import React, { useState } from "react";
// import { Calendar } from "primereact/calendar"; // yarn add primereact
// import { Button, Col, Row } from "react-bootstrap";
// import { MultiSelect } from "primereact/multiselect";

// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";
// import { Line } from "react-chartjs-2";

// import "primereact/resources/themes/lara-light-cyan/theme.css";

// export default function StatisticsAmbience() {
//   const [date1, setDate1] = useState(null);
//   const [date2, setDate2] = useState(null);
//   const [dates, setDates] = useState(null);

//   const [selectedCities, setSelectedCities] = useState(null);
//   // const cities = [
//   //   { name: "New York", code: "NY" },
//   //   { name: "Rome", code: "RM" },
//   //   { name: "London", code: "LDN" },
//   //   { name: "Istanbul", code: "IST" },
//   //   { name: "Paris", code: "PRS" },
//   // ];

//   const cities = [
//     { id: "1", name: "opcion 1" },
//     { id: "2", name: "opcion 2" },
//     { id: "3", name: "opcion 3" },
//     { id: "4", name: "opcion 4" },
//     { id: "5", name: "opcion 5" },
//   ];

//   const handleSelector = (event) => {
//     const value = event.value;
//     setSelectedCities(value);
//     console.log(value);
//     logAll();
//   };

//   const handleCalendar = (event) => {
//     setDates(event.value);
//     // const formated = event.value.map((date) => {
//     //   return date?.toISOString().split("T")[0];
//     // });
//     // setDates(formated);
//     // logAll();
//   };

//   const logAll = () => {
//     console.log("Datos", date1, date2, dates, selectedCities);
//   };

//   const handleRange = () => {
//     logAll();
//   };

//   const DATA_COUNTLine = 7;
//   const NUMBER_CFGLine = { count: DATA_COUNTLine, min: -100, max: 100 };
//   const labelsLine = Utils.months({ count: 7 });
//   // Utils.months({ count: 7 });

//   const dataLine = {
//     labels: labelsLine,
//     datasets: [
//       {
//         label: "Dataset 1",
//         data: Utils.numbers(NUMBER_CFGLine),
//         borderColor: Utils.CHART_COLORS.red,
//         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//         yAxisID: "y",
//       },
//       {
//         label: "Dataset 2",
//         data: Utils.numbers(NUMBER_CFGLine),
//         borderColor: Utils.CHART_COLORS.blue,
//         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
//         yAxisID: "y1",
//       },
//     ],
//   };

//   // <block:config:0>
//   const configLine = {
//     type: "line",
//     data: dataLine,
//     options: {
//       responsive: true,
//       interaction: {
//         mode: "index",
//         intersect: false,
//       },
//       stacked: false,
//       plugins: {
//         title: {
//           display: true,
//           text: "Chart.js Line Chart - Multi Axis",
//         },
//       },
//       scales: {
//         y: {
//           type: "linear",
//           display: true,
//           position: "left",
//         },
//         y1: {
//           type: "linear",
//           display: true,
//           position: "right",

//           // grid line settings
//           grid: {
//             drawOnChartArea: false, // only want the grid lines for one axis to show up
//           },
//         },
//       },
//     },
//   };
//   // </block:config>

//   module.exports = {
//     actions: actions,
//     config: configLine,
//   };
//   // </block:setup>

//   return (
//     <div>
//       <div>
//         <h1 className="text-center mb-4">Estadisicas de ambiente</h1>
//       </div>

//       <div className="search-cotainer mb-4">buscador</div>

//       <div className="tag-container position-relative mb-3">
//         <label className="tag-label">Nombre de aula</label>

//         <div className="mb-3">
//           <Row className="mt-3">
//             <Col xs md="auto">
//               <label className="total-requests mb-4"> Estado: Habilitado</label>
//             </Col>
//             <Col xs md="auto">
//               <Row xs md="auto">
//                 <Col xs md="auto">
//                   <label className="mb-3"> Inicio</label>
//                   <Calendar
//                     value={date1}
//                     onChange={(e) => {
//                       setDate1(e.value);
//                       console.log(date1);
//                     }}
//                   />
//                 </Col>

//                 <Col xs="auto" md="auto">
//                   <label className="mb-3"> Fin</label>
//                   <Calendar
//                     value={date2}
//                     onChange={(e) => {
//                       setDate2(e.value);
//                       console.log(date2);
//                     }}
//                   />
//                 </Col>
//               </Row>
//             </Col>

//             <Col className="justify-content-center" xs="auto" md="auto">
//               <Button onClick={handleRange}>Buscar por rango</Button>
//             </Col>
//           </Row>
//           <Row className="justify-content-center mb-4" lg={2}>
//             <MultiSelect
//               value={selectedCities}
//               onChange={handleSelector}
//               options={cities}
//               optionLabel="name"
//               display="chip"
//               placeholder="Select Cities"
//               maxSelectedLabels={4}
//               className="w-full md:w-20rem mt-3"
//             />
//             <Calendar
//               value={dates}
//               onChange={handleCalendar}
//               selectionMode="range"
//               readOnlyInput
//               hideOnRangeSelection
//             />
//           </Row>
//           <Line data={dataLine} />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Button, Col, Row } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "primereact/resources/themes/lara-light-cyan/theme.css";

// Registrando los componentes de Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsAmbience() {
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [dates, setDates] = useState(null);
  const [selectedCities, setSelectedCities] = useState(null);

  const cities = [
    { id: "1", name: "opcion 1" },
    { id: "2", name: "opcion 2" },
    { id: "3", name: "opcion 3" },
    { id: "4", name: "opcion 4" },
    { id: "5", name: "opcion 5" },
  ];

  const handleSelector = (event) => {
    const value = event.value;
    setSelectedCities(value);
    console.log(value);
    logAll();
  };

  const handleCalendar = (event) => {
    setDates(event.value);
  };

  const logAll = () => {
    console.log("Datos", date1, date2, dates, selectedCities);
  };

  const handleRange = () => {
    logAll();
  };

  // Datos del gráfico de línea
  const dataLine = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
    datasets: [
      {
        label: "Dataset 1",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y",
      },
      {
        label: "Dataset 2",
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y1",
      },
    ],
  };

  // Configuración del gráfico de línea
  const optionsLine = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Line Chart - Multi Axis",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div>
      <div>
        <h1 className="text-center mb-4">Estadísticas de ambiente</h1>
      </div>

      <div className="search-cotainer mb-4">buscador</div>

      <div className="tag-container position-relative mb-3">
        <label className="tag-label">Nombre de aula</label>

        <div className="mb-3">
          <Row className="mt-3">
            <Col xs md="auto">
              <label className="total-requests mb-4"> Estado: Habilitado</label>
            </Col>
            <Col xs md="auto">
              <Row xs md="auto">
                <Col xs md="auto">
                  <label className="mb-3"> Inicio</label>
                  <Calendar
                    value={date1}
                    onChange={(e) => {
                      setDate1(e.value);
                      console.log(date1);
                    }}
                  />
                </Col>

                <Col xs="auto" md="auto">
                  <label className="mb-3"> Fin</label>
                  <Calendar
                    value={date2}
                    onChange={(e) => {
                      setDate2(e.value);
                      console.log(date2);
                    }}
                  />
                </Col>
              </Row>
            </Col>

            <Col className="justify-content-center" xs="auto" md="auto">
              <Button onClick={handleRange}>Buscar por rango</Button>
            </Col>
          </Row>
          <Row className="justify-content-center mb-4" lg={2}>
            <MultiSelect
              value={selectedCities}
              onChange={handleSelector}
              options={cities}
              optionLabel="name"
              display="chip"
              placeholder="Seleccionar ciudades"
              maxSelectedLabels={4}
              className="w-full md:w-20rem mt-3"
            />
            <Calendar
              value={dates}
              onChange={handleCalendar}
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
            />
          </Row>
          <Line data={dataLine} options={optionsLine} />
        </div>
      </div>
    </div>
  );
}

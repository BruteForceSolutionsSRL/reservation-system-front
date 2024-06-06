// import { Button, Col, Row, Table } from "react-bootstrap";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js"; // npm install --save chart.js react-chartjs-2
// import { useState } from "react";
// import { useEffect } from "react";

// ChartJS.register(
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend
// );
// export default function StatisticsElement(props) {
//   const {
//     classroom_id,
//     classroom_name,
//     classroom_type_id,
//     classroom_type_name,
//     classroom_status_id,
//     classroom_status_name,
//     capacity,
//     floor,
//     block_id,
//     block_name,
//   } = props;
//   const [pendingData, setPendingData] = useState([]);
//   const [aceptedData, setAceptedData] = useState([]);
//   const [cancelData, setCancelData] = useState([]);
//   const [rejectData, setRejectData] = useState([]);

//   const [etiquetas, setEtiquetas] = useState(null);
//   const [array, setArray] = useState([]);

//   const fechaInicio = "2024-03-01";
//   const fechaFin = "2024-03-10";

//   const stats = {
//     chart: [
//       {
//         date: "2024-04-22",
//         accepted: 1,
//         rejected: 0,
//         pending: 0,
//         cancelled: 0,
//       },
//       {
//         date: "2024-07-26",
//         accepted: 0,
//         rejected: 3,
//         pending: 0,
//         cancelled: 0,
//       },
//     ],
//     table: [
//       {
//         reservation_reason_id: 2,
//         reservation_reason_name: "CLASES",
//         total_reservations: 1,
//         average_students: 125.0,
//       },
//       {
//         reservation_reason_id: 1,
//         reservation_reason_name: "EXAMEN",
//         total_reservations: 3,
//         average_students: 256.6667,
//       },
//       {
//         reservation_reason_id: 3,
//         reservation_reason_name: "DEFENSA DE TESIS",
//         total_reservations: 0,
//         average_students: 0,
//       },
//       {
//         reservation_reason_id: 4,
//         reservation_reason_name: "PRACTICA",
//         total_reservations: 0,
//         average_students: 0,
//       },
//     ],
//   };

//   useEffect(() => {
//     setEtiquetas(chartData.date);
//     // setAceptedData([65, 59, 80, 81, 56, 55, 40]);
//     // setAceptedData(stats.chart.accepted);
//     setCancelData([28, 48, 40, 19, 86, 27, 90]);
//     setRejectData([18, 38, 40, 50, 86, 27, 30]);
//     setPendingData([18, 38, 40, 50, 86, 27, 30]);
//     setArray(stats.table);
//     // ChartTableComponent(stats);
//   }, []);

//   //
//   // const ChartTableComponent = ({ stats }) => {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const processChartData = () => {
//       const processedData = stats.chart.map((entry) => ({
//         date: entry.date,
//         accepted: entry.accepted,
//         rejected: entry.rejected,
//         pending: entry.pending,
//         cancelled: entry.cancelled,
//       }));
//       setChartData(processedData);
//     };

//     processChartData();
//   }, [stats.chart]);

//   const [tableData, setTableData] = useState([]);

//   useEffect(() => {
//     const processTableData = () => {
//       setTableData(stats.table);
//     };

//     processTableData();
//   }, [stats.table]);
//   // };
//   //
//   const optionsLine = {
//     responsive: true,
//     interaction: {
//       mode: "index",
//       intersect: false,
//     },
//     stacked: false,
//     plugins: {
//       title: {
//         display: true,
//         text: "Reservas realizadas por fecha",
//       },
//     },
//     scales: {
//       y: {
//         type: "linear",
//         display: true,
//         position: "left",
//       },
//       y1: {
//         type: "linear",
//         display: true,
//         position: "right",
//         grid: {
//           drawOnChartArea: false,
//         },
//       },
//     },
//   };

//   const dataLine = {
//     // labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
//     labels: etiquetas,
//     datasets: [
//       {
//         label: "Aceptados",
//         data: chartData.accepted,
//         borderColor: "rgba(255, 99, 132, 1)",
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         // yAxisID: "y",
//       },
//       {
//         label: "Cancelados",
//         data: chartData.cancelled,
//         borderColor: "rgba(54, 162, 235, 1)",
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         // yAxisID: "y1",
//       },
//       {
//         label: "Rechazados",
//         data: chartData.rejected,
//         borderColor: "rgba(54, 500, 235, 1)",
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         // yAxisID: "y2",
//       },
//       {
//         label: "Pendientes",
//         data: chartData.pending,
//         borderColor: "rgba(300, 100, 235, 1)",
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         // yAxisID: "y3",
//       },
//     ],
//   };

//   // const generarEtiquetasDeFechasDiarias = (fechaInicio, fechaFin) => {
//   //   const etiquetas = [];
//   //   let fechaActual = new Date(fechaInicio);

//   //   while (fechaActual <= new Date(fechaFin)) {
//   //     const dia = fechaActual.getDate().toString().padStart(1, "0");
//   //     const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
//   //     const año = fechaActual.getFullYear();
//   //     etiquetas.push(`${año}/${mes}/${dia}`);
//   //     fechaActual.setDate(fechaActual.getDate() + 1);
//   //   }
//   //   // console.log(etiquetas);
//   //   return etiquetas;
//   // };

//   return (
//     <div className="tag-container position-relative mb-3">
//       <label className="tag-label">{classroom_name}</label>

//       <div className="mb-3">
//         <Row className="mt-3">
//           <Col xs md="auto">
//             <label className="total-requests mb-4">
//               Estado: {classroom_status_name}
//             </label>
//           </Col>
//           <Col xs md="auto">
//             <Row xs md="auto">
//               <Col xs md="auto">
//                 <label className="mb-3"> Inicio</label>
//                 <input
//                   type="date"
//                   // id="start"
//                   // name="trip-start"
//                   value="2024-03-01"
//                   min="2024-03-01"
//                   max="2024-07-01"
//                 />

//                 {/* <Calendar
//                     value={date1}
//                     onChange={(e) => {
//                       setDate1(e.value);
//                       console.log(date1);
//                     }}
//                   /> */}
//               </Col>

//               <Col xs="auto" md="auto">
//                 <label className="mb-3"> Fin</label>
//                 <input type="date" />
//                 {/* <Calendar
//                     value={date2}
//                     onChange={(e) => {
//                       setDate2(e.value);
//                       console.log(date2);
//                     }}
//                   /> */}
//               </Col>
//             </Row>
//           </Col>

//           <Col className="justify-content-center" xs="auto" md="auto">
//             {/* <Button onClick={handleRange}>Buscar por rango</Button> */}
//             <Button>Buscar por rango</Button>
//           </Col>
//         </Row>
//         <Row className="justify-content-center mb-4">
//           {/* <MultiSelect
//               value={selectedCities}
//               onChange={handleSelector}
//               options={cities}
//               optionLabel="name"
//               display="chip"
//               placeholder="Seleccionar ciudades"
//               maxSelectedLabels={4}
//               className="w-full md:w-20rem mt-3"
//             /> */}
//           {/* <Calendar
//               value={dates}
//               onChange={handleCalendar}
//               selectionMode="range"
//               readOnlyInput
//               hideOnRangeSelection
//             /> */}
//           <Col md={4}>
//             <div>
//               <b>aksd</b>
//             </div>
//           </Col>
//           <Col md={4}>
//             {/* tabla, grafico */}

//             <h5>MOTIVOS</h5>
//             <div>
//               <Table bordered responsive>
//                 <thead>
//                   <tr>
//                     <th>Motivo</th>
//                     <th>Cantidad</th>
//                     <th>Cantidad de Estudiantes</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tableData.map((row) => (
//                     <tr key={row.reservation_reason_id}>
//                       <td>{row.reservation_reason_name}</td>
//                       <td>{row.total_reservations}</td>
//                       <td>{row.average_students}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Col>
//           <Col md={4}>
//             <Line data={dataLine} options={optionsLine} />
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// }

import { Button, Col, Row, Table } from "react-bootstrap";
import { Line } from "react-chartjs-2";
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
import { useState, useEffect } from "react";

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

export default function StatisticsElement(props) {
  const { classroom_name, classroom_status_name } = props;

  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [cancelledData, setCancelledData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);

  const [etiquetas, setEtiquetas] = useState([]);
  const [tableData, setTableData] = useState([]);

  const stats = {
    chart: [
      {
        date: "2024-04-22",
        accepted: 1,
        rejected: 0,
        pending: 0,
        cancelled: 0,
      },
      {
        date: "2024-07-26",
        accepted: 0,
        rejected: 3,
        pending: 0,
        cancelled: 0,
      },
    ],
    table: [
      {
        reservation_reason_id: 2,
        reservation_reason_name: "CLASES",
        total_reservations: 1,
        average_students: 125.0,
      },
      {
        reservation_reason_id: 1,
        reservation_reason_name: "EXAMEN",
        total_reservations: 3,
        average_students: 256.6667,
      },
      {
        reservation_reason_id: 3,
        reservation_reason_name: "DEFENSA DE TESIS",
        total_reservations: 0,
        average_students: 0,
      },
      {
        reservation_reason_id: 4,
        reservation_reason_name: "PRACTICA",
        total_reservations: 0,
        average_students: 0,
      },
    ],
  };

  useEffect(() => {
    const processChartData = () => {
      const dates = stats.chart.map((entry) => entry.date);
      const accepted = stats.chart.map((entry) => entry.accepted);
      const rejected = stats.chart.map((entry) => entry.rejected);
      const pending = stats.chart.map((entry) => entry.pending);
      const cancelled = stats.chart.map((entry) => entry.cancelled);

      setEtiquetas(dates);
      setAcceptedData(accepted);
      setRejectedData(rejected);
      setPendingData(pending);
      setCancelledData(cancelled);
    };

    processChartData();
  }, [stats.chart]);

  useEffect(() => {
    const processTableData = () => {
      setTableData(stats.table);
    };

    processTableData();
  }, [stats.table]);

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
        text: "Reservas realizadas por fecha",
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

  const dataLine = {
    labels: etiquetas,
    datasets: [
      {
        label: "Aceptados",
        data: acceptedData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Cancelados",
        data: cancelledData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Rechazados",
        data: rejectedData,
        borderColor: "rgba(54, 500, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Pendientes",
        data: pendingData,
        borderColor: "rgba(300, 100, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  return (
    <div className="tag-container position-relative mb-3">
      <label className="tag-label">{classroom_name}</label>

      <div className="mb-3">
        <Row className="mt-3">
          <Col xs md="auto">
            <label className="total-requests mb-4">
              Estado: {classroom_status_name}
            </label>
          </Col>
          <Col xs md="auto">
            <Row xs md="auto">
              <Col xs md="auto">
                <label className="mb-3">Inicio</label>
                <input
                  type="date"
                  value="2024-03-01"
                  min="2024-03-01"
                  max="2024-07-01"
                />
              </Col>

              <Col xs="auto" md="auto">
                <label className="mb-3">Fin</label>
                <input type="date" />
              </Col>
            </Row>
          </Col>

          <Col className="justify-content-center" xs="auto" md="auto">
            <Button>Buscar por rango</Button>
          </Col>
        </Row>
        <Row className="justify-content-center mb-4">
          <Col md={4}>
            <div>
              <b>otro grafico</b>
            </div>
          </Col>
          <Col md={4}>
            <h5>MOTIVOS</h5>
            <div>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Motivo</th>
                    <th>Cantidad</th>
                    <th>Cantidad de Estudiantes</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.reservation_reason_id}>
                      <td>{row.reservation_reason_name}</td>
                      <td>{row.total_reservations}</td>
                      <td>{row.average_students}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={4}>
            <Line data={dataLine} options={optionsLine} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

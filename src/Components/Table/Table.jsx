import React from 'react';
import Table from 'react-bootstrap/Table';
import Cell from './Cell';

const COLORS = {
    header: '#A5D8FF',
    default: '#B2F2BB'
};

const cellCss = {
  width: '100px',
  height: '40px',
  textAlign: 'center',
};

const periods = [
    [1, '06:45'],
    [2, '07:30'],
    [3, '08:15'],
    [4, '09:00'],
    [5, '09:45'],
    [6, '10:30'],
    [7, '11:15'],
    [8, '12:00'],
    [9, '12:45'],
    [10, '13:30'],
    [11, '14:15'],
    [12, '15:00'],
    [13, '15:45'],
    [14, '16:30'],
    [15, '17:15'],
    [16, '18:00'],
    [17, '18:45'],
    [18, '19:30'],
    [19, '20:15'],
    [20, '21:00'],
    [21, '21:45'],
];

const filterPeriods = (range) => {
    return periods.filter(([id]) => id >= range[0] && id <= range[1]);
};

const createHeader = (environments) => (
    <tr>
        {/* Celda de cabecera fija */}
        <Cell name="Ambiente" type="th-f" color={COLORS.header} style={cellCss}/>
        {environments.map((env, index) => (
            <Cell key={index} name={env.classroom_name} type="th-d" color={COLORS.header} style={cellCss}/>
        ))}
    </tr>
);

const createRow = (periodId, periodTime, environments) => {
    const cells = environments.map((env, envIndex) => {
        const colorData = env.colors.find((c) => c.id === periodId);
        const color = colorData ? colorData.color : COLORS.default;

        return <Cell key={`cell-${envIndex}-${periodId}`} color={color} type="td-d" style={cellCss}/>;
    });

    // Añadir celda de periodo al inicio de la fila
    cells.unshift(
        <Cell key={`periodo-${periodId}`} type="td-f" name={periodTime} color={COLORS.default} style={cellCss}/>
    );

    return <tr key={periodId}>{cells}</tr>;
};

const createRows = (filteredPeriods, environments) => {
    return filteredPeriods.map(([periodId, periodTime]) => 
        createRow(periodId, periodTime, environments)
    );
};

export default function TableDinamic({ range, environments }) {
    const filteredPeriods = filterPeriods(range);

    return (
        <div className="table-responsive">
            <Table>
                <thead>
                    {createHeader(environments)}
                </thead>
                <tbody>
                    {createRows(filteredPeriods, environments)}
                </tbody>
            </Table>
        </div>
    );
}

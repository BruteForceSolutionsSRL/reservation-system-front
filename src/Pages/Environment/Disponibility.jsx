import React, { useState } from "react";
import TableDinamic from "../../Components/Table/Table.jsx";
import Blocks from "../../Components/Environment/Blocks.jsx";
import Classrooms from "../../Components/Classrooms/Classrooms.jsx";

export default function Disponibility() {
  let environments = [
    {
      classroom_name: "Auditorio",
      colors: [
        {
          id: 1,
          color: "#FFD8A8",
        },
        {
          id: 14,
          color: "#FFD8A8",
        },
        {
          id: 15,
          color: "#FFC9C9",
        },
        {
          id: 16,
          color: "#FFC9C9",
        },
        {
          id: 21,
          color: "#FFD8A8",
        },
      ],
    },
    {
      classroom_name: "693A",
      colors: [],
    },
    {
      classroom_name: "693B",
      colors: [],
    },
    {
      classroom_name: "693C",
      colors: [],
    },
    {
      classroom_name: "693D",
      colors: [
        {
          id: 2,
          color: "#FFD8A8",
        },
        {
          id: 3,
          color: "#FFD8A8",
        },
        {
          id: 4,
          color: "#FFD8A8",
        },
        {
          id: 5,
          color: "#FFC9C9",
        },
      ],
    },
    {
      classroom_name: "693F",
      colors: [
        {
          id: 6,
          color: "#FFD8A8",
        },
        {
          id: 7,
          color: "#FFD8A8",
        },
        {
          id: 8,
          color: "#FFD8A8",
        },
        {
          id: 10,
          color: "#FFC9C9",
        },
      ],
    },
    {
      classroom_name: "692A",
      colors: [],
    },
    {
      classroom_name: "692B",
      colors: [],
    },
    {
      classroom_name: "692C",
      colors: [],
    },
    {
      classroom_name: "692D",
      colors: [],
    },
    {
      classroom_name: "692E",
      colors: [],
    },
    {
      classroom_name: "692F",
      colors: [],
    },
    {
      classroom_name: "691A",
      colors: [],
    },
    {
      classroom_name: "691B",
      colors: [],
    },
  ];

  let blocks = [
    {
      block_id: 0,
      block_name: "Edificio nuevo",
      block_maxfloor: 0,
    },
  ];

  let classrooms = [
    {
      classroom_id: 0,
      classroom_name: "Auditorio",
      capacity: 0,
      floor_number: 0,
    },
    {
      classroom_id: 0,
      classroom_name: "693A",
      capacity: 0,
      floor_number: 0,
    },
    {
      classroom_id: 0,
      classroom_name: "693B",
      capacity: 0,
      floor_number: 0,
    },
  ];

  return (
    <>
      <div className="content-fluid">
        <h1 className="text-center">Disponibilidad de ambiente</h1>
        <div>
          <Classrooms blocks={blocks} classrooms={classrooms} />
        </div>
        <div>
          <TableDinamic environments={environments} range={[0, 16]} />
        </div>
      </div>
    </>
  );
}

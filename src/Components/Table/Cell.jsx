import React from 'react';
import './Cell.css';

// Componente Cell
export default function Cell({ color, name, type }) {
    // Determinar el estilo de fondo en función del color o un valor predeterminado
    const backgroundColor = color || '#E9ECEF';

    // Determinar el estilo de tamaño de celda
    const cellStyle = {
        backgroundColor,
        width: '100px', // Ancho fijo de 100px
        height: '40px', // Altura fija de 40px
        textAlign: 'center',
    };

    // Renderizar la celda según el tipo
    const renderCell = () => {
        switch (type) {
            case 'th-d':
                return (
                    <th className="" style={cellStyle}>
                        {name}
                    </th>
                );
            case 'th-f':
                return (
                    <th className="static" style={{ ...cellStyle, backgroundColor: '#E9ECEF' }}>
                        {name}
                    </th>
                );
            case 'td-d':
                return (
                    <td className="" style={cellStyle}>
                        {name}
                    </td>
                );
            default:
                return (
                    <td className="static" style={{ ...cellStyle, backgroundColor: '#E9ECEF' }}>
                        {name}
                    </td>
                );
        }
    };

    return renderCell();
}

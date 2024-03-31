import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import '../../Layout.css';
import estilos from './tablaCompras.module.css'
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Compras() {
    const [compras, setCompras] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredCompras = compras.filter(compra =>
        compra.id_compra.toString().includes(filtro) ||
        compra.numero_compra.toString().includes(filtro) ||
        compra.fecha_compra.toString().includes(filtro) ||
        compra.total_compra.toString().includes(filtro)||
        compra.nombre_proveedor.toString().toLowerCase().includes(filtro)||
        compra.estado_compra.toString().includes(filtro)
    
    );
    const generarPDF = () => {
        const doc = new jsPDF();
    
        // Encabezado del PDF
        doc.text("Reporte de Compras", 20, 10);
    
        // Definir las columnas que se mostrarán en el informe (excluyendo "Estado")
        const columnasInforme = [
            "Id",
            "Número",
            "Fecha",
            "Total compra",
            "Proveedor"
        ];
    
        // Filtrar los datos de las compras para incluir solo las columnas deseadas
        const datosInforme = filteredCompras.map(compra => {
            const { id_compra, numero_compra, fecha_compra, total_compra, nombre_proveedor } = compra;
            return [id_compra, numero_compra, fecha_compra, total_compra, nombre_proveedor];
        });
    
        // Agregar la tabla al documento PDF
        doc.autoTable({
            startY: 20,
            head: [columnasInforme],
            body: datosInforme
        });
    
        // Guardar el PDF
        doc.save("reporte_compras.pdf");
    };
    

    const columns = [
        {
            name : "Id",
            selector: (row)=>row.id_compra,
            sortable: true
        },
        {
            name : "Número",
            selector: (row)=>row.numero_compra,
            sortable: true
        },
        {
            name : "Fecha",
            selector: (row)=>row.fecha_compra,
            sortable: true,
            
        },
        {
            name : "Total compra",
            selector: (row)=>row.total_compra,
            sortable: true
        },
        {
            name : "Proveedor",
            selector: (row)=>row.nombre_proveedor,
            sortable: true,
        },
        {
            name: "Estado",
            cell: (row) => (
                
                <div className={estilos["acciones"]}>
<button className={estilos.boton} onClick={() => handleEstadoCompra(row.id_compra, row.estado_compra)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
    {row.estado_compra === 1 ? (
        <i className="bi bi-toggle-on" style={{ color: "#1F67B9" }}></i>
    ) : (
        <i className="bi bi-toggle-off" style={{ width: "60px", color: "black" }}></i>
    )}
</button>

                </div>
            )
        },

    ]

    useEffect(() => {
        fetchCompras();
    }, []);

    useEffect(() => {
        if (compras.length > 0) {
            setIsLoading(false);
        }
    }, [compras]);

    const fetchCompras = async () => {
        try {
            const response = await fetch('http://localhost:8082/compras/compras');
            if (response.ok) {
                const data = await response.json();
                const comprasFiltrador = data.map(compra => ({
                    id_compra: compra.id_compra,
                    numero_compra: compra.numero_compra,
                    fecha_compra: formatDate(compra.fecha_compra), // Formatear la fecha
                    total_compra: compra.total_compra,
                    nombre_proveedor: compra.nombre_proveedor,
                    estado_compra: compra.estado_compra,
                }));
                setCompras(comprasFiltrador);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };


 

    const handleEstadoCompra = async (idCompra, estadoCompra) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cambiar el estado del usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = estadoCompra === 1 ? 0 : 1;
    
                    const response = await fetch(`http://localhost:8082/compras/compras/${idCompra}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_compra: nuevoEstado
                        })
                    });
    
                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de compras
                        fetchCompras();
                    } else {
                        console.error('Error al actualizar el estado del usuario');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        });
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };
    

const customStyles = {
    headCells: {
        style: {
            textAlign: 'center',
            backgroundColor: '#f2f2f2',
            fontWeight: 'bold',
            padding: '10px',
            fontSize: '16px'
        },
    },
    cells: {
        style: {
            textAlign: 'center',

            fontSize: '13px'
        },
    },
};


    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div>
            <h1>Compras</h1>
            </div>

            <div className={estilos.botones}>
                <Link to="/registrarCompra">
                    <button className={`boton ${estilos.botonAgregar}`}><i className="fa-solid fa-plus"></i> Agregar</button>
                </Link>
                <button
                    style={{ marginBottom: "50px", marginLeft: "50px", color: "white" }}
                    className={`boton ${estilos.vinotinto}`}
                    onClick={generarPDF}
                >
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>
        <br />
            <div className={estilos['filtro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
            </div>
          
            <div className={estilos["tabla"]}>
            <DataTable columns={columns} data={filteredCompras} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_compra" defaultSortAsc={true}></DataTable>
            </div>
        </div>
    );
}

export default Compras;

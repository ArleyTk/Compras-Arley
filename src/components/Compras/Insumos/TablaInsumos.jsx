import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import '../../Layout.css';
import estilos from './TablaInsumos.module.css'
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function Insumos() {
    const [insumos, setinsumos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredinsumos = insumos.filter(insumo =>
        insumo.id_insumo.toString().includes(filtro) ||
        insumo.nombre_insumo.toString().toLowerCase().includes(filtro) ||
        insumo.unidadesDeMedida_insumo.toString().toLowerCase().includes(filtro) ||
        insumo.stock_insumo.toString().includes(filtro) ||
        insumo.nombre_categoria.toString().toLowerCase().includes(filtro) ||
        insumo.estado_insumo.toString().includes(filtro)

    );

    const generarPDF = () => {
        const doc = new jsPDF();
    
        // Encabezado del PDF
        doc.text("Reporte de Insumos", 20, 10);
    
        // Definir las columnas que se mostrarán en el informe
        const columnasInforme = [
            "Id",
            "Nombre",
            "Medida",
            "Stock",
            "Categoría"
        ];
    
        // Filtrar los datos de los insumos para incluir solo las columnas deseadas
        const datosInforme = filteredinsumos.map(insumo => {
            const { id_insumo, nombre_insumo, unidadesDeMedida_insumo, stock_insumo, nombre_categoria } = insumo;
            return [id_insumo, nombre_insumo, unidadesDeMedida_insumo, stock_insumo, nombre_categoria];
        });
    
        // Agregar la tabla al documento PDF
        doc.autoTable({
            startY: 20,
            head: [columnasInforme],
            body: datosInforme
        });
    
        // Guardar el PDF
        doc.save("reporte_insumos.pdf");
    };
    


    const columns = [
        {
            name: "Id",
            selector: (row) => row.id_insumo,
            sortable: true
        },
        {
            name: "Imagen",
            cell: (row) => (
                <img id={estilos.imagen_i}
                    src={row.imagen_insumo ? row.imagen_insumo : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'}
                    width="55px"
                    height="55px" />
            ),
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_insumo,
            sortable: true,

        },
        {
            name: "Medida",
            selector: (row) => row.unidadesDeMedida_insumo,
            sortable: true
        },
        {
            name: "Stock",
            selector: (row) => row.stock_insumo,
            sortable: true
        },
        {
            name: "Categoría",
            selector: (row) => row.nombre_categoria,
            sortable: true
        },
        {
            name: "Estado",
            cell: (row) => (

                <div className={estilos["acciones"]}>
                    <button className={estilos.boton} onClick={() => handleEstadoinsumo(row.id_insumo, row.estado_insumo)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        {row.estado_insumo === 1 ? (
                            <i className="bi bi-toggle-on" style={{ color: "#1F67B9" }}></i>
                        ) : (
                            <i className="bi bi-toggle-off" style={{ width: "60px", color: "black" }}></i>
                        )}
                    </button>


                </div>
            )
        },
        {
            name: "Acciones",
            cell: (row) => (

                <div className={estilos["acciones"]}>
                    <Link to={`/EditarInsumo/${row.id_insumo}`}>
                        <button className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                            <i className="fa-solid fa-pen-to-square iconosRojos"></i>
                        </button>
                    </Link>


                </div>
            )
        },

    ]

    useEffect(() => {
        fetchinsumos();
    }, []);

    useEffect(() => {
        if (insumos.length > 0) {
            setIsLoading(false);
        }
    }, [insumos]);

    const fetchinsumos = async () => {
        try {
            const response = await fetch('http://localhost:8082/compras/insumos');
            if (response.ok) {
                const data = await response.json();
                const insumosFiltrador = data.map(insumo => ({
                    id_insumo: insumo.id_insumo,
                    imagen_insumo: insumo.imagen_insumo,
                    nombre_insumo: insumo.nombre_insumo,
                    unidadesDeMedida_insumo: insumo.unidadesDeMedida_insumo,
                    stock_insumo: insumo.stock_insumo,
                    nombre_categoria: insumo.nombre_categoria,
                    estado_insumo: insumo.estado_insumo,
                }));
                setinsumos(insumosFiltrador);
            } else {
                console.error('Error al obtener las insumos');
            }
        } catch (error) {
            console.error('Error al obtener las insumos:', error);
        }
    };




    const handleEstadoinsumo = async (idinsumo, estadoinsumo) => {
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
                    const nuevoEstado = estadoinsumo === 1 ? 0 : 1;

                    const response = await fetch(`http://localhost:8082/compras/estadoInsumo/${idinsumo}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_insumo: nuevoEstado
                        })
                    });

                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de insumos
                        fetchinsumos();
                    } else {
                        console.error('Error al actualizar el estado del usuario');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        });
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
                <h1>Insumos</h1>
            </div>

            <div className={estilos.botones}>
                <Link to="/RegistrarInsumo">
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
                <DataTable columns={columns} data={filteredinsumos} pagination paginationPerPage={5} highlightOnHover customStyles={customStyles} defaultSortField="id_insumo" defaultSortAsc={true}></DataTable>
            </div>
        </div>
    );
}
export default Insumos;
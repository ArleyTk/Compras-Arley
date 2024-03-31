import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import '../../Layout.css';
import estilos from './TablaProveedores.module.css'
import Swal from 'sweetalert2';
import Modal from './modal';
import styled from 'styled-components';
import DataTable from "react-data-table-component";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
    const [proveedores1, setProveedores1] = useState({
        nombre_proveedor: '',
        telefono_proveedor: '',
        direccion_proveedor: '',
        estado_proveedor: 1
    });
    const [proveedoresEditar, setProveedoresEditar] = useState({
        nombre_proveedor: '',
        telefono_proveedor: '',
        direccion_proveedor: '',
        estado_proveedor: 1
    });
    const [isLoading, setIsLoading] = useState(true);
    const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);

    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredproveedores = proveedores.filter(proveedor =>
        proveedor.id_proveedor.toString().includes(filtro) ||
        proveedor.nombre_proveedor.toString().toLowerCase().includes(filtro) ||
        proveedor.telefono_proveedor.toString().includes(filtro) ||
        proveedor.direccion_proveedor.toString().toLowerCase().includes(filtro) ||
        proveedor.estado_proveedor.toString().includes(filtro)

    );

    const generarPDF = () => {
        const doc = new jsPDF();
    
        // Encabezado del PDF
        doc.text("Reporte de Proveedores", 20, 10);
    
        // Definir las columnas que se mostrarán en el informe (excluyendo "Estado")
        const columnasInforme = [
            "Id",
            "Nombre",
            "Teléfono",
            "Dirección"
        ];
    
        // Filtrar los datos de los proveedores para incluir solo las columnas deseadas
        const datosInforme = filteredproveedores.map(proveedor => {
            const { id_proveedor, nombre_proveedor, telefono_proveedor, direccion_proveedor } = proveedor;
            return [id_proveedor, nombre_proveedor, telefono_proveedor, direccion_proveedor];
        });
    
        // Agregar la tabla al documento PDF
        doc.autoTable({
            startY: 20,
            head: [columnasInforme],
            body: datosInforme
        });
    
        // Guardar el PDF
        doc.save("reporte_proveedores.pdf");
    };
    

    const columns = [
        {
            name: "Id",
            selector: (row) => row.id_proveedor,
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_proveedor,
            sortable: true
        },
        {
            name: "Teléfono",
            selector: (row) => row.telefono_proveedor,
            sortable: true,

        },
        {
            name: "Dirección",
            selector: (row) => row.direccion_proveedor,
            sortable: true
        },
        {
            name: "Estado",
            cell: (row) => (

                <div className={estilos["acciones"]}>
                    <button className={estilos.boton} onClick={() => handleEstadoproveedor(row.id_proveedor, row.estado_proveedor)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        {row.estado_proveedor === 1 ? (
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

                    <button onClick={() => {
                        cambiarEstadoModalEditar(!estadoModaleditar),
                            setProveedoresEditar(row)
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i class="fa-solid fa-pen-to-square iconosRojos"></i>
                    </button>

                </div>
            )
        },

    ]
    const handleSubmitEditar = async (event) => {
        event.preventDefault();

        console.log(proveedores)

        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información del proveedor?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/compras/proveedores/${proveedoresEditar.id_proveedor}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(proveedoresEditar)
                    });

                    if (response.ok) {
                        console.log('proveedor actualizado exitosamente.');
                        Swal.fire({
                            icon: 'success',
                            title: 'proveedor actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            window.location.href = '/proveedores';
                        }, 2000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                    } else {
                        console.error('Error al actualizar el proveedor:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar el proveedor',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar el proveedor:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar el proveedor',
                    });
                }
            }
        });
    };

    useEffect(() => {
        fetchproveedores();
    }, []);

    useEffect(() => {
        if (proveedores.length > 0) {
            setIsLoading(false);
        }
    }, [proveedores]);

    const fetchproveedores = async () => {
        try {
            const response = await fetch('http://localhost:8082/compras/proveedores');
            if (response.ok) {
                const data = await response.json();
                const proveedoresFiltrador = data.map(proveedor => ({
                    id_proveedor: proveedor.id_proveedor,
                    nombre_proveedor: proveedor.nombre_proveedor,
                    telefono_proveedor: proveedor.telefono_proveedor,
                    direccion_proveedor: proveedor.direccion_proveedor,
                    estado_proveedor: proveedor.estado_proveedor,
                }));
                setProveedores(proveedoresFiltrador);
            } else {
                console.error('Error al obtener las proveedores');
            }
        } catch (error) {
            console.error('Error al obtener las proveedores:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProveedores1(prevproveedores => ({
            ...prevproveedores,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log('proveedor a enviar: ', proveedores1)


            const responseProveedores = await fetch('http://localhost:8082/compras/proveedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proveedores1)
            });

            if (responseProveedores.ok) {
                console.log('Proveedor creado exitosamente.');

                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.href = '/proveedores';
                }, 2000);


            } else {
                console.error('Error al crear el proveedor:', responseProveedores.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear el proveedor',
                });
            }
        } catch (error) {
            console.error('Error al crear el proveedor:', error);
        }
    };

    const handleEditarChange = (event) => {
        const { name, value } = event.target;
        setProveedoresEditar(prevproveedores => ({
            ...prevproveedores,
            [name]: value
        }));
    };
    
    const handleEstadoproveedor = async (idproveedor, estadoproveedor) => {
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
                    const nuevoEstado = estadoproveedor === 1 ? 0 : 1;

                    const response = await fetch(`http://localhost:8082/compras/estadoProveedor/${idproveedor}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_proveedor: nuevoEstado
                        })
                    });

                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de proveedores
                        fetchproveedores();
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
                <h1>Proveedores</h1>
            </div>

            <div className={estilos.botones}>
                <button onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={`boton ${estilos.botonAgregar}`}><i className="fa-solid fa-plus"></i> Agregar</button>

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
                <DataTable columns={columns} data={filteredproveedores} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_proveedor" defaultSortAsc={true}></DataTable>
            </div>
            <Modal
                estado={estadoModalAgregar}
                cambiarEstado={cambiarEstadoModalAgregar}
                titulo="Registar"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'20px'}
            >
                <Contenido>

                    <form onSubmit={handleSubmit}>
                        <div id={estilos.contenedorsito}>
                            <div id={estilos.contInput}>
                                <br />
                                <br />
                                <div className={estilos["inputIdNombre"]}>
                                    <div>
                                        <p id={estilos.textito}>  Nombre</p>
                                        <input
                                            id={estilos.nombreproveedor}
                                            className={estilos["input2"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_proveedor'
                                            value={proveedores.nombre_proveedor}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div id={estilos.telefonoproveedor}>
                                        <p id={estilos.textito} >  Teléfono</p>
                                        <input
                                            className={estilos["input2"]}
                                            type="number"
                                            placeholder="Insertar teléfono"
                                            name='telefono_proveedor'
                                            value={proveedores1.telefono_proveedor}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}>  Dirección</p>
                                        <input
                                            id={estilos.direccionproveedor}
                                            className={estilos["input-field2"]}
                                            type="text"
                                            placeholder="Insertar dirección"
                                            name='direccion_proveedor'
                                            value={proveedores1.direccion_proveedor}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </div>



                        </div>
                        <center>
                            <div className={estilos["cajaBotones"]}>
                                <button onclick="registrar()" className={estilos.azulado3} type="submit"><p style={{ marginLeft: "-10px" }}> Guardar</p> </button>
                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button style={{ color: "white", }} onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={estilos.gris} type="button"> <p style={{ marginLeft: "-13px" }}> Cancelar</p></button>
                            </div>
                        </center>
                    </form>
                </Contenido>
            </Modal>

            <Modal
                estado={estadoModaleditar}
                cambiarEstado={cambiarEstadoModalEditar}
                titulo="Actualizar"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'20px'}
            >
                <Contenido>

                    <form onSubmit={handleSubmitEditar}>
                        <div id={estilos.contenedorsito}>
                            <div id={estilos.contInput}>
                            <br />
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito} > Nombre</p>
                                        <input
                                            id={estilos.nombreproveedor}
                                            className={estilos["input2"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_proveedor'
                                            value={proveedoresEditar.nombre_proveedor}
                                            onChange={handleEditarChange}
                                        />
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito} > Teléfono</p>
                                        <input
                                            id={estilos.telefonoproveedor}
                                            className={estilos["input2"]}
                                            type="text"
                                            placeholder="Insertar teléfono"
                                            name='telefono_proveedor'
                                            value={proveedoresEditar.telefono_proveedor}
                                            onChange={handleEditarChange}
                                        />
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}> Dirección</p>
                                        <input
                                            id={estilos.direccionproveedor}
                                            className={estilos["input-field2"]}
                                            type="text"
                                            placeholder="Insertar dirección"
                                            name='direccion_proveedor'
                                            value={proveedoresEditar.direccion_proveedor}
                                            onChange={handleEditarChange}
                                        />
                                    </div>

                                </div>
                            </div>

                        </div>

                        <br />
                        <center>
                            <div className={estilos["cajaBotones"]}>
                            <button onClick={() => registrar()} className={estilos.azulado3} type="submit"><p style={{ marginLeft: "-10px" }}> Guardar</p> </button>

                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button style={{color: "white"}} onClick={() => cambiarEstadoModalEditar(!estadoModaleditar)} className={estilos.gris} type="button"> <p style={{ marginLeft: "-13px" }}> Cancelar</p></button>
                            </div>
                        </center>
                    </form>
                </Contenido>
            </Modal>
        </div>
    );
}

const Contenido = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	h1 {
		font-size: 42px;
		font-weight: 700;
		margin-bottom: 10px;
	}

	p {
		font-size: 18px;
		margin-bottom: 20px;
	}

	img {
		width: 100%;
		vertical-align: top;
		border-radius: 3px;
	}
`;

export default Proveedores;
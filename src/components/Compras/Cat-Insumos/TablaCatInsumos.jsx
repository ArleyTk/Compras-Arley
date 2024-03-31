import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import '../../Layout.css';
import estilos from './TablaCat-Insumos.module.css';
import Modal from './modal';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";

function categoria_insumos() {
    const [categoria_insumos, setcategoria_insumos] = useState([]);
    const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);

    const [categoria_insumos1, setCategoria_insumos1] = useState({
        nombre_categoria_insumos: '',
        estado_categoria_insumos: 1
    });

    const [categoria_insumosEditar, setCategoria_insumosEditar] = useState({
        nombre_categoria_insumos: '',
        estado_categoria_insumos: 1
    });

    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredcategoria_insumos = categoria_insumos.filter(categoria_insumos =>
        (categoria_insumos.id_categoria_insumos && categoria_insumos.id_categoria_insumos.toString().includes(filtro)) ||
        (categoria_insumos.nombre_categoria_insumos && categoria_insumos.nombre_categoria_insumos.toString().toLowerCase().includes(filtro)) ||
        (categoria_insumos.estado_categoria_insumos && categoria_insumos.estado_categoria_insumos.toString().includes(filtro))
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCategoria_insumos1(prevcategoria_insumos => ({
            ...prevcategoria_insumos,
            [name]: value
        }));
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log('categoría de insumo  a enviar: ', categoria_insumos1)


            const responseCategoria_insumos = await fetch('http://localhost:8082/compras/categoria_insumos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria_insumos1)
            });

            if (responseCategoria_insumos.ok) {
                console.log('categoría de insumo creada exitosamente.');

                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.href = '/CatInsumos';
                }, 2000);


            } else {
                console.error('Error al crear la categoría de insumo:', responseCategoria_insumos.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear la categoría de insumo',
                });
            }
        } catch (error) {
            console.error('Error al crear la categoría de insumo:', error);
        }
    };

    const handleEditarChange = (event) => {
        const { name, value } = event.target;
        setCategoria_insumosEditar(prevcategoria_insumos => ({
            ...prevcategoria_insumos,
            [name]: value
        }));
    };

    const columns = [
        {
            name : "Id",
            selector: (row)=>row.id_categoria_insumos,
            sortable: true
        },
        
        {
            name : "Nombre",
            selector: (row)=>row.nombre_categoria_insumos,
            sortable: true,
            
        },
        {
            name: "Estado",
            cell: (row) => (
                
                <div className={estilos["acciones"]}>
<button className={estilos.boton} onClick={() => handleEstadocategoria_insumo(row.id_categoria_insumos, row.estado_categoria_insumos)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
    {row.estado_categoria_insumos === 1 ? (
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
                            setCategoria_insumosEditar(row)
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i className="fa-solid fa-pen-to-square iconosRojos"></i>
                    </button>

                </div>
            )
        },

    ]

    useEffect(() => {
        fetchcategoria_insumos();
    }, []);

    useEffect(() => {
        if (categoria_insumos.length > 0) {
            setIsLoading(false);
        }
    }, [categoria_insumos]);

    const fetchcategoria_insumos = async () => {
        try {
            const response = await fetch('http://localhost:8082/compras/categoria_insumos');
            if (response.ok) {
                const data = await response.json();
                const categoria_insumosFiltrador = data.map(categoria_insumos => ({
                    id_categoria_insumos: categoria_insumos.id_categoria_insumos,
                    nombre_categoria_insumos: categoria_insumos.nombre_categoria_insumos,
                    estado_categoria_insumos: categoria_insumos.estado_categoria_insumos,
                }));
                setcategoria_insumos(categoria_insumosFiltrador);
            } else {
                console.error('Error al obtener las categoria_insumos');
            }
        } catch (error) {
            console.error('Error al obtener las categoria_insumos:', error);
        }
    };


    const handleSubmitEditar = async (event) => {
        event.preventDefault();

        console.log(categoria_insumos)

        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información de la categoría de insumo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/compras/categoria_insumos/${categoria_insumosEditar.id_categoria_insumos}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(categoria_insumosEditar)
                    });

                    if (response.ok) {
                        console.log('categoría de insumo actualizado exitosamente.');
                        Swal.fire({
                            icon: 'success',
                            title: 'categoría de insumo actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            window.location.href = '/CatInsumos';
                        }, 2000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                    } else {
                        console.error('Error al actualizar la categoría de insumo:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar la categoría de insumo',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar la categoría de insumo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar la categoría de insumo',
                    });
                }
            }
        });
    };

    const handleEstadocategoria_insumo = async (idcategoria_insumos, estadocategoria_insumos) => {
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
                    const nuevoEstado = estadocategoria_insumos === 1 ? 0 : 1;
    
                    const response = await fetch(`http://localhost:8082/compras/estadoCatInsumos/${idcategoria_insumos}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_categoria_insumos: nuevoEstado
                        })
                    });
    
                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de categoria_insumos
                        fetchcategoria_insumos();
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
            <h1>Categoria de insumos</h1>
            </div>

            <div className={estilos.botones}>

                    <button style={{marginBottom:"50px"}} onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={`boton ${estilos.botonAgregar}`}><i className="fa-solid fa-plus"></i> Agregar</button>


            </div>
       <br />
            <div className={estilos['filtro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
            </div>
          
            <div className={estilos["tabla"]}>
            <DataTable columns={columns} data={filteredcategoria_insumos} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_categoria_insumo" defaultSortAsc={true}></DataTable>
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

                                <br />
                                <br />
                                <br />
                                <div className={estilos["inputIdNombre"]}>
                                    <div>
                                        <p id={estilos.textito}>  Nombre</p>
                                        <input
                                            id={estilos.nombre_categoria_insumos}
                                            className={estilos["input-field2"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_categoria_insumos'
                                            value={categoria_insumos.nombre_categoria_insumos}
                                            onChange={handleChange}
                                        />
                                    </div>


                                
                                <br />

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
                                            id={estilos.nombre_categoria_insumos}
                                            className={estilos["input2"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_categoria_insumos'
                                            value={categoria_insumosEditar.nombre_categoria_insumos}
                                            onChange={handleEditarChange}
                                        />
                                    </div>

                                </div>
                                <br />

                                <br />

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
export default categoria_insumos;
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net-bs5';
import '../Layout.css'
import estilos from '../Usuarios/Usuarios.module.css'

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    useEffect(() => {
        if (usuarios.length > 0) {
            setIsLoading(false);
        }
    }, [usuarios]);

    useLayoutEffect(() => {
        if (tableRef.current && !isLoading) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
            $(tableRef.current).DataTable({
                pageLength: 5,
                paging: true,
                searching: true,
                ordering: true,
                lengthChange: true,
                info: false,
                language: {
                    paginate: {
                        first: '<<',
                        previous: '<',
                        next: '>',
                        last: '>>',
                    },
                    search: 'Buscar'
                },
            });
        }
    }, [usuarios, isLoading]);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:8082/configuracion/usuarios');
            if (response.ok) {
                const data = await response.json();
                const usuariosFiltrador = data.map(usuario => ({
                    id_usuario: usuario.id_usuario,
                    imagen_usuario: usuario.imagen_usuario,
                    nombre_usuario: usuario.nombre_usuario,
                    direccion_usuario: usuario.direccion_usuario,
                    telefono_usuario: usuario.telefono_usuario,
                    email: usuario.email,
                    id_rol: usuario.id_rol,
                }));
                setUsuarios(usuariosFiltrador);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };

    const handleDeleteUsuario = async (idUsuario) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:8082/configuracion/usuarios/${idUsuario}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    // Eliminación exitosa, actualizar la lista de compras
                    fetchUsuarios();
                } else {
                    console.error('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
        }
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
            <center>
                <div id="titulo">
                    <h1>Gestión Usuarios</h1>
                </div>
                <br />
            </center>
            <div className={estilos["botones"]}>
                <Link to="/agregarUsuarios">
                    <button className={`boton ${estilos.botonRojo}`}><i className="fa-solid fa-plus"></i> Agregar</button>
                </Link>
            </div>
            <table className="tablaDT ui celled table" style={{ width: "100%" }} ref={tableRef}>
                <thead>
                    <tr>
                        <th><i className={["fa-solid fa-key iconosRojos"]}></i>Cedula</th>
                        <th><i className={["fa-solid fa-image iconosRojos"]}></i>Imagen</th>
                        <th><i className={["fa-solid fa-font iconosRojos"]}></i>Nombre</th>
                        <th><i className={["fa-sharp fa-solid fa-location-dot iconosRojos"]}></i> Dirección</th>
                        <th><i className={["fa-solid fa-phone iconosRojos"]}></i>Telefono</th>
                        <th><i className={["fa-solid fa-envelope iconosRojos"]}></i>Correo</th>
                        <th><i className={["fa-solid fa-person iconosRojos"]}></i>Id Rol</th>
                        <th><i className={["fa-solid fa-gear iconosRojos"]}></i> Funciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.id_usuario}>
                            <td>{usuario.id_usuario}</td>
                            <td>{usuario.imagen_usuario}</td>
                            <td>{usuario.nombre_usuario}</td>
                            <td>{usuario.direccion_usuario}</td>
                            <td>{usuario.telefono_usuario}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.id_rol}</td>
                            <td>
                                <button onClick={() => handleDeleteUsuario(usuario.id_usuario)}>
                                    <i className="fas fa-trash iconosRojos"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Usuarios;

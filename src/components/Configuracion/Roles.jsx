import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net-bs5';
import '../Layout.css'
import estilos from '../Configuracion/Roles.module.css'

function Roles() {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (roles.length > 0) {
            setIsLoading(false);
        }
    }, [roles]);

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
    }, [roles, isLoading]);

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:8082/configuracion/roles');
            if (response.ok) {
                const data = await response.json();
                const rolesFiltrados = data.map(rol => ({
                    id_rol: rol.id_rol,
                    nombre_rol: rol.nombre_rol,
                    descripcion_rol: rol.descripcion_rol,
                    estado_rol: rol.estado_rol,
                }));
                setRoles(rolesFiltrados);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };

    const handleDeleteRoles = async (idRol) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:8082/configuracion/usuarios/${idRol}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    // Eliminación exitosa, actualizar la lista de compras
                    fetchRoles();
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
                    <h1>Gestión de Roles</h1>
                </div>
                <br />
            </center>
            <Link to={'/agregarRoles'}>
                <div className={estilos["botones"]}>
                    <button className={`boton ${estilos.botonRojo}`}><i className={[".fa-solid fa-plus"]}></i> Agregar</button>
                </div>
            </Link>
            <table classNameName="tablaDT ui celled table" style={{ width: "100%" }} ref={tableRef}>
                <thead>
                    <tr>
                        <th><i className={["fa-solid fa-key iconosRojos"]}></i> ID</th>
                        <th><i className={["fa-solid fa-font iconosRojos"]}></i> Nombre</th>
                        <th><i className={["fa-solid fa-message iconosRojos"]}></i> Descripción</th>
                        <th><i className={["fa-solid fa-check iconosRojos"]}></i> Permisos</th>
                        <th><i className={["fa-solid fa-gear iconosRojos"]}></i> Funciones</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(rol => (
                        <tr key={rol.id_rol}>
                            <td>{rol.id_rol}</td>
                            <td>{rol.nombre_rol}</td>
                            <td>{rol.descripcion_rol}</td>
                            <td>{rol.estado_rol}</td>
                            <td>
                                <button onClick={() => handleDeleteRoles(rol.id_rol)}>
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

export default Roles;

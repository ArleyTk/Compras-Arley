import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
    const [selectedModule, setSelectedModule] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".module-heading, .options li")) {
                setSelectedModule(null);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleModuleClick = (module) => {
        setSelectedModule(selectedModule === module ? null : module);
    };

    return (
        <div>
            <div className="barraPrincipal">
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
                <div className="contenedor_1">
                    <img src="/archivos/imagenes/LuchoGod.png" height="45px" length="45px" alt="Logo" />
                    <p id="luchosoft">LuchoSoft</p>
                </div>
            </div>

            <div className="contenedor">
                <div className="barraLateral">

                    <div className="sidebar">
                        <div className="module">
                            <p className={`module-heading ${selectedModule === "Configuración" ? "selected" : ""}`} onClick={() => handleModuleClick("Configuración")}>
                                Configuración <i className="bi bi-chevron-down arrow-icon"></i>
                            </p>
                            <Link to={"/roles"}>
                                <ul className={`options ${selectedModule === "Configuración" ? "active" : ""}`}>
                                    <li>Roles</li>
                                </ul>
                            </Link>
                        </div>

                        <div className="module">
                            <p className={`module-heading ${selectedModule === "Usuarios" ? "selected" : ""}`} onClick={() => handleModuleClick("Usuarios")}>
                                Usuarios <i className="bi bi-chevron-down arrow-icon"></i>
                            </p>
                            <Link to="/usuarios">
                                <ul className={`options ${selectedModule === "Usuarios" ? "active" : ""}`}>
                                    <li>Usuarios</li>
                                </ul>
                            </Link>
                        </div>

                        <div className="module">
                            <p className={`module-heading ${selectedModule === "Compras" ? "selected" : ""}`} onClick={() => handleModuleClick("Compras")}>
                                Compras <i className="bi bi-chevron-down arrow-icon"></i>
                            </p>
                            <ul className={`options ${selectedModule === "Compras" ? "active" : ""}`}>
                             
                            <Link to="/CatInsumos">
                                <li>Categoria de insumos</li>
                                </Link>
                                <Link to="/Insumos">
                                <li>Insumos</li>
                                </Link>
                                <Link to="/Proveedores">
                                <li>Proveedores</li>
                                </Link>
                                <Link to="/Compra">
                                <li>Compras</li>
                                </Link>
                               
                            </ul>
                        </div>

                        <div className="module">
                            <p className={`module-heading ${selectedModule === "Producción" ? "selected" : ""}`} onClick={() => handleModuleClick("Producción")}>
                                Producción <i className="bi bi-chevron-down arrow-icon"></i>
                            </p>
                            <ul className={`options ${selectedModule === "Producción" ? "active" : ""}`}>
                                <li>Orden de producción</li>
                            </ul>
                        </div>

                        <div className="module">
                            <p className={`module-heading ${selectedModule === "Ventas" ? "selected" : ""}`} onClick={() => handleModuleClick("Ventas")}>
                                Ventas <i className="bi bi-chevron-down arrow-icon"></i>
                            </p>
                            <ul className={`options ${selectedModule === "Ventas" ? "active" : ""}`}>
                                <li>Categoria de productos</li>
                                <li>Productos</li>
                                <li>Clientes</li>
                                <li>Pedidos</li>
                                <li>Ventas</li>
                            </ul>
                        </div>
                        <div className="usuario">
                            <Link to="/home">
                                <a className="usuario-link">
                                    <img src="/archivos/imagenes/Profile.png" alt="" />
                                    <span id="spanIcono">Nombre de Usuario</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="contenido">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;

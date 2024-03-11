import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';
import estilos from '../Configuracion/Roles.module.css'

function AgregarRoles() {

    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div className={estilos["contenido2"]}>

                <br />
                <center>
                    <div id={estilos.titulo}>
                        <h2>Registrar Rol</h2>

                    </div>
                </center>
                <br />
                <br />
                <form>
                    <div id={estilos.contenedorsito}>
                        <div id={estilos.contInput}>
                            <div className={estilos["input-container"]}>
                                <div id={estilos.eo}>
                                    <p id={estilos.textito}> <i class="fa-solid fa-key iconosRojos"></i> ID del rol</p>
                                    <input id={estilos.idrol} className={estilos["input-field"]} type="number" placeholder="Ingrese el ID del rol" />
                                </div>

                            </div>
                            <br />
                            <div className={estilos["input-container"]}>
                                <div id={estilos.eo}>
                                    <p id={estilos.textito} > <i class="fa-solid fa-font iconosRojos"></i> Nombre del rol</p>

                                    <input id={estilos.nombrerol} className={estilos["input-field"]} type="text" placeholder="Insertar nombre" />
                                </div>

                            </div>
                            <br />
                            <div className={estilos["input-container"]}>
                                <div id={estilos.eo}>
                                    <p id={estilos.textito}> <i class="fa-solid fa-message iconosRojos"></i> Descripción del rol</p>

                                    <input id={estilos.descrol} className={estilos["input-field"]} type="text" placeholder="Insertar descripción" />
                                </div>

                            </div>
                        </div>
                        <div className={estilos["input-container"]}>
                            <div className={estilos["contDerechaAbajo"]}>
                                <br />

                                <div id={estilos.seleccionarpermisos}>


                                    <table id={estilos.tablita} className={estilos["tablitaMarginRight"]}>
                                        <thead>
                                            <tr>
                                                <th id={estilos.fondotabla} style={{ color: 'rgb(255, 255, 255)' }}>Seleccionar permisos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input type="checkbox" className={estilos["checkbox"]} />
                                                    Ventas
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type="checkbox" className={estilos["checkbox"]} />
                                                    Insumos
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type="checkbox" className={estilos["checkbox"]} />
                                                    Compras
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type="checkbox" className={estilos["checkbox"]} />
                                                    Producción
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>

                                </div>
                            </div>

                        </div>


                    </div>



                </form>
                <br />
                <center>
                    <div className={estilos["cajaBotones"]}>
                        <button onclick="registrar()" className={estilos["vinotinto"]} type="button">Guardar</button>
                        <div className={estilos["espacioEntreBotones"]}></div>
                        <button className={estilos["rojo"]} type="button" onclick="window.location.href='gestionroles.html'">Cancelar</button>
                    </div>
                </center>
                <br />
                <br />

            </div>

        </div>
    );
}

export default AgregarRoles;
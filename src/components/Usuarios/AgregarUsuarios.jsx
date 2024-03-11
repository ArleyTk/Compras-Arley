import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import '../Layout.css'
import estilos from '../Usuarios/Usuarios.module.css'

function AgregarUsuarios() {
    return(
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div className={estilos["contenido2"]}>
                <br/>
                <center>
                    <div id={estilos.titulo}>
                        <h1>Registro Usuario</h1>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </center>
                <div id={estilos.contenedorsitos}>
                    <div id={estilos.contenedorsito}>
                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo"]} id={estilos.grupo__cedula}>
                                <label for="cedula"><i className={["fa-solid fa-id-card iconosRojos"]}></i>Cedula</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="text" name="cedula" id={estilos.cedula}/>
                                    <span></span>
                                </div>
                            </div>
                        </div>

                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo"]} id={estilos.grupo__nombre}>
                                <label for="nombre"> <i className={["fa-solid fa-font iconosRojos"]}></i>Nombre</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="text" name="nombre" id={estilos.nombre}/>
                                    <span></span>
                                </div>
                            </div>
                        </div>


                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo"]} id={estilos.grupo__telefono}>
                                <label for="telefono"><i className={["fa-solid fa-phone iconosRojos"]}></i> Telefono</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="text" name="telefono" id={estilos.telefono}/>
                                    <span></span>
                                </div>
                            </div>
                        </div>

                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo"]} id={estilos.grupo__direccion}>
                                <label for="direccion"><i className={["fa-sharp fa-solid fa-location-dot iconosRojos"]}></i>
                                    Dirección</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="text" name="direccion" id={estilos.direccion}/>
                                    <span></span>
                                </div>
                            </div>
                        </div>


                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo"]} id={estilos.grupo__password}>
                                <label for="password"><i className={["fa-solid fa-lock iconosRojos"]}></i>Contraseña</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="password" name="password" id={estilos.password}/>
                                    <span></span>
                                </div>
                            </div>
                        </div>

                        <div className={estilos["input-container"]}>
                            <div className={estilos["eo"]}>
                                <p className={estilos[""]}><i className={["fas fa-user-shield iconosRojos"]}></i>Correo</p>
                                <input className={estilos["input-field"]} type="email" name="correo" id={estilos.correo}/>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div id={estilos.cosas}>
                        <center>
                            <br/>
                            <br/>
                            <div className={`${estilos.divImagen} ${estilos.input1}`} >
                                <p><i className={["fa-solid fa-image iconosRojos"]}></i> URL Imagen</p>
                                <img id={estilos.imagen_i}
                                    src="https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180"
                                    width="200px"/>
                                <br/>
                                <br/>
                                <input onchange="" id={estilos.imagen_usuario} className={estilos["input-field2"]} type="text"
                                    placeholder="URL de la imagen"/>
                            </div>
                        </center>
                        <br/>
                    </div>
                </div>

                <div className={estilos["botonsito"]}>
                    <button className={`boton ${estilos.botonMorado}`} onclick="validarCamposAgregar()"><i></i> Guardar</button>
                    <button className={`boton ${estilos.botonRojo}`} onclick="window.location.href='gestionUsuario.html' ">
                        <i className={[""]}></i> Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AgregarUsuarios;
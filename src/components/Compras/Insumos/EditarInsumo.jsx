import React, { useState, useEffect } from 'react';
import '../../Layout.css';
import estilos from '../Insumos/nsumos.module.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function Editarinsumo() {

    const [categoria_insumo, setcategoria_insumo] = useState([]);

    let { id_insumo } = useParams();
    console.log(id_insumo)

    const [insumo, setinsumo] = useState({
        id_insumo: '',
        imagen_insumo: '',
        nombre_insumo: '',
        unidadesDeMedida_insumo: '', 
        stock_insumo: '',
        estado_insumo: '',
        id_categoria_insumo: ''
    });

    const handleCancel = () => {
        Swal.fire({
          title: '¿Desea cancelar el registro del insumo?',
          text: 'Los datos ingresados se perderán.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/Insumos';
          }
        });
    };

    useEffect(() => {
        const fetchinsumo = async () => {
            try {
                const response = await fetch(`http://localhost:8082/compras/insumos/${id_insumo}`);
                if (response.ok) {
                    const data = await response.json();
                    const insumoFiltrado = data[0];
                    setinsumo(insumoFiltrado);
                    console.log(insumoFiltrado)
                } else {
                    console.error('Error al obtener el insumo');
                }
            } catch (error) {
                console.error('Error al obtener el insumo:', error);
            }
        };

        fetchinsumo();
    }, [id_insumo]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setinsumo(previnsumo => ({
            ...previnsumo,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchcategoria_insumo = async () => {
            try {
                const response = await fetch('http://localhost:8082/compras/categoria_insumos');
                if (response.ok) {
                    const data = await response.json();
                    const categoria_insumoFiltrados = data.map(categoria_insumo => ({
                        id_categoria_insumos: categoria_insumo.id_categoria_insumos,
                        nombre_categoria_insumos: categoria_insumo.nombre_categoria_insumos,
                        estado_categoria_insumos: categoria_insumo.estado_categoria_insumos,
                    }));
                    setcategoria_insumo(categoria_insumoFiltrados);
                    console.log(categoria_insumo);
                } else {
                    console.error('Error al obtener las compras');
                }
            } catch (error) {
                console.error('Error al obtener las compras:', error);
            }
        };

        fetchcategoria_insumo(); // Llama a la función fetchcategoria_insumo cuando se monta el componente

    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(insumo)

        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información del insumo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/compras/insumos/${insumo.id_insumo}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(insumo)
                    });

                    if (response.ok) {
                        console.log('insumo actualizado exitosamente.');
                        Swal.fire({
                            icon: 'success',
                            title: 'insumo actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            window.location.href = '/insumos';
                        }, 1000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                    } else {
                        console.error('Error al actualizar el insumo:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar el insumo',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar el insumo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar el insumo',
                    });
                }
            }
        });

    };


    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div className={estilos["contenido2"]}>
            <h1 style={{ marginLeft: "50px" }}>Actualizar</h1>
                <br />
                <center>
                    <div id={estilos.titulo}>
                      
                        <br />
                        <br />
                        <br />
                    </div>
                </center>
                <form onSubmit={handleSubmit}>
                    <div id={estilos.contenedorsitos}>
                        <div id={estilos.contenedorsito}>


                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__nombre_insumo}>
                                    <label for="nombre_insumo"> <i className={["fa-solid fa-font iconosRojos"]}></i>nombre_insumo</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field"]}
                                            type="text"
                                            name="nombre_insumo"
                                            id={estilos.nombre_insumo}
                                            value={insumo ? insumo.nombre_insumo : ''}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} >
                                    <label htmlFor="unidadesDeMedida_insumo"> Unidades</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <select
                                            className={estilos["input-field"]}
                                            name="unidadesDeMedida_insumo"
                                            id={estilos.unidadesDeMedida_insumo_input}
                                            value={insumo ? insumo.unidadesDeMedida_insumo : ''}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled selected>Seleccionar unidad de medida</option>
                                            <option value="kilogramos">Kilogramo</option>
                                            <option value="litros">Litro</option>
                                            <option value="piezas">Pieza</option>
                                            <option value="gramos">Gramos</option>
                                            <option value="miligramos">Miligramos</option>
                                            <option value="mililitros">Mililitro</option>
                                            <option value="toneladas">Tonelada</option>
                                        </select>

                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__direccion}>
                                    <label htmlFor="stock_insumo"> Stock</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field"]}
                                            type="number"
                                            name="stock_insumo" // Corregido el nombre del campo
                                            id={estilos.stock_insumo_input}
                                            value={insumo ? insumo.stock_insumo : ''}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>


                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__id_rol}>
                                    <label htmlFor="id_categoria_insumo">Seleccionar Categoría</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <select
                                            className={estilos["input-field"]}
                                            name="id_categoria_insumo" // Utiliza el mismo nombre que el campo id_rol
                                            id={estilos.id_categoria_insumo_input} // Cambia el id para que sea único
                                            value={insumo.id_categoria_insumo}
                                            onChange={handleChange}
                                        >
                                             <option value="" disabled selected>Seleccionar categoría</option>
                                            {categoria_insumo.map(categoria_insumo => (
                                                <option value={categoria_insumo.id_categoria_insumos}>{categoria_insumo.nombre_categoria_insumos}</option>
                                            ))}
                                        </select>
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div id={estilos.cosas}>
                            <center>
                                <br />
                                <br />
                                <div className={`${estilos.divImagen} ${estilos.input1}`} >
                                    <p><i className={["fa-solid fa-image iconosRojos"]}></i> URL Imagen</p>
                                    <img id={estilos.imagen_i}
                                        src={insumo.imagen_insumo ? insumo.imagen_insumo : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'}
                                        width="200px" />
                                    <br />
                                    <br />
                                    <input
                                        id={estilos.imagen_insumo}
                                        className={estilos["input-field2"]}
                                        type="text"
                                        placeholder="URL de la imagen"
                                        name='imagen_insumo'
                                        value={insumo ? insumo.imagen_insumo : ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </center>
                            <br />
                        </div>
                    </div>




                    <div style={{ marginRight: "200px" }} className="cajaBotones">
          <button type="submit" id="can" className="boton azulado3"><center>Guardar</center></button>
          <button style={{color: "white"}} type="button" className="boton gris" onClick={handleCancel}>Cancelar</button>
        </div>
                </form>



            </div>
        </div>
    );
}

export default Editarinsumo;
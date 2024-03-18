import React, { useState, useEffect, useRef } from 'react';
import './registroCompras.css';
import { Outlet, Link } from "react-router-dom";
import { Table, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';

function App() {
  const [insumos, setInsumos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [precio, setPrecio] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [compra, setCompra] = useState({
    id_compra: '',
    numero_compra: '',
    fecha_compra: '',
    estado_compra: 1,
    total_compra: 0,
    id_proveedor: ''
  });
  const [proveedores, setProveedores] = useState([]);
  const tableRef = useRef(null);
  const [tableRows, setTableRows] = useState([{ nombre: '', precio: '', cantidad: '', cantidad_seleccionada: 0, precio_unitario: 0 }]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [insumosPerPage] = useState(5);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [selectedInsumos, setSelectedInsumos] = useState(new Set());
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    fetchInsumos();
    fetchProveedores();
  }, []);

  useEffect(() => {
    if (insumos.length > 0) {
      setIsLoading(false);
    }
  }, [insumos]);

  const fetchInsumos = async () => {
    try {
      const response = await fetch('http://localhost:8082/compras/insumos');
      if (response.ok) {
        const data = await response.json();
        const insumosConSeleccion = data.map(insumo => ({ ...insumo, seleccionado: false, cantidad: 0, precio_unitario: 0 }));
        setInsumos(insumosConSeleccion);
      } else {
        console.error('Error al obtener los insumos');
      }
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
    }
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...tableRows];
    const deletedInsumo = updatedRows[index].nombre;
    updatedRows.splice(index, 1);
    setTableRows(updatedRows);

    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.precio_total) || 0);
    }, 0);
    setPrecioTotal(total);

    setSelectedInsumos(prevSelected => {
      prevSelected.delete(deletedInsumo);
      return new Set(prevSelected);
    });
    setFormChanged(true);
  };

  const fetchProveedores = async () => {
    try {
      const response = await fetch('http://localhost:8082/compras/proveedores');
      if (response.ok) {
        const data = await response.json();
        setProveedores(data);
      } else {
        console.error('Error al obtener los proveedores');
      }
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name !== 'search') {
      setCompra({ ...compra, [name]: value });
      setFormChanged(true);
    }
  };
  const filteredInsumos = insumos.filter(insumo =>
    insumo.nombre_insumo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectChange = (event, index) => {
    const { value } = event.target;
    if (selectedInsumos.has(value)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Este insumo ya ha sido seleccionado',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }
  
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        const selectedInsumo = insumos.find(insumo => insumo.nombre_insumo === value);
        return { ...row, nombre: value, insumoId: selectedInsumo.id_insumo };
      }
      return row;
    });
  
    setTableRows(updatedRows);
  
    setSelectedInsumos(prevSelected => new Set(prevSelected.add(value)));
    setFormChanged(true);
  };

  const handleCantidadChange = (event, index) => {
    const { value } = event.target;
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        const cantidad = parseFloat(value) || 0;
        const precioUnitario = parseFloat(row.precio_unitario) || 0;
        const precioTotal = cantidad * precioUnitario;
        return { ...row, cantidad: value, cantidad_seleccionada: cantidad, precio_total: precioTotal };
      }
      return row;
    });
    setTableRows(updatedRows);

    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.precio_total) || 0);
    }, 0);
    setPrecioTotal(total);
    setFormChanged(true);
  };
  
  const handleSubmitCompra = async (event, totalCompra, precio) => {
    event.preventDefault();
  
    if (!compra.fecha_compra || !compra.numero_compra || !compra.id_proveedor || tableRows.some(row => !row.nombre || !row.precio || !row.cantidad)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hay campos vacíos',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }
  
    Swal.fire({
      icon: 'success',
      title: '',
      text: 'Compra registrada',
      showConfirmButton: false,
      timer: 2000, // Tiempo en milisegundos antes de que el mensaje se cierre automáticamente
    }).then(async () => {
      try {
        const totalCompra = tableRows.reduce((total, row) => total + parseFloat(row.precio_total || 0), 0);
  
        const responseCompra = await fetch('http://localhost:8082/compras/compras', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...compra, total_compra: totalCompra })
        });
  
        if (!responseCompra.ok) {
          console.error('Error al enviar los datos de la compra');
          return;
        }
  
        const compraData = await responseCompra.json();
        const idCompra = compraData.id_compra;
  
        console.log('Compra registrada correctamente:', compraData, "id_compra: ", idCompra);
  
        const insumosSeleccionados = tableRows.filter(row => row.nombre !== '').map(row => ({
          id_insumo: insumos.find(insumo => insumo.nombre_insumo === row.nombre).id_insumo,
          cantidad: row.cantidad_seleccionada,
          precio_unitario: row.precio_unitario
        }));
  
        const comprasInsumosPromises = insumosSeleccionados.map(async (insumoSeleccionado) => {
          const insumoCorrespondiente = insumos.find(insumo => insumo.id_insumo === insumoSeleccionado.id_insumo);
          const comprasInsumosData = {
            cantidad_insumo_compras_insumos: insumoSeleccionado.cantidad,
            precio_insumo_compras_insumos: insumoSeleccionado.precio_unitario,
            id_compra: idCompra,
            id_insumo: insumoSeleccionado.id_insumo
          };
  
          try {
            const responseComprasInsumos = await fetch('http://localhost:8082/compras/compras_insumos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(comprasInsumosData)
            });
  
            if (!responseComprasInsumos.ok) {
              console.error('Error al enviar los datos de compras_insumo:', responseComprasInsumos.statusText);
            } else {
              console.log('Insumo registrado correctamente:', comprasInsumosData);
            }
          } catch (error) {
            console.error('Error al enviar los datos de compras_insumo:', error);
          }
        });
  
        await Promise.all(comprasInsumosPromises);
      } catch (error) {
        console.error('Error al enviar los datos:', error);
      }
      
      // Redirigir a otra página después de que el mensaje desaparezca
      window.location.href = '/Compra'; // Reemplaza '/Compra' con la URL de la página a la que quieres redirigir
    });
  };
  
  

  const handlePrecioChange = (e, index) => {
    const { value } = e.target;
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        return { ...row, precio: value, precio_unitario: parseFloat(value) || 0 };
      }
      return row;
    });
    setTableRows(updatedRows);

    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.precio_unitario) || 0);
    }, 0);
    setPrecioTotal(total);

    if (updatedRows.length > 6) {
      setScrollEnabled(true);
    }
    setFormChanged(true);
  };

  const handleCancel = () => {
    if (formChanged) {
      Swal.fire({
        title: '¿Desea cancelar el registro de la compra?',
        text: 'Los datos ingresados se perderán.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        cancelButtonColor: 'gray',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirigir a la página de compras
          window.location.href = '/Compra'; // Reemplaza '/Compra' con la URL de la página a la que quieres redirigir
        }
      });
    } else {
      // Redirigir a la página de compras
      window.location.href = '/Compra'; // Reemplaza '/Compra' con la URL de la página a la que quieres redirigir
    }
  };

  if (isLoading) {
    return <div>Cargando la api, espere por favor...</div>;
  }

  const indexOfLastInsumo = currentPage * insumosPerPage;
  const indexOfFirstInsumo = indexOfLastInsumo - insumosPerPage;
  const currentInsumos = filteredInsumos.slice(indexOfFirstInsumo, indexOfLastInsumo);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredInsumos.length / insumosPerPage); i++) {
    pageNumbers.push(i);
  }

  const addTableRow = () => {
    const newRow = { nombre: '', precio: '', cantidad: '' };
    setTableRows([...tableRows, newRow]);
    setFormChanged(true);
  };

  return (
    <div className='contenido-2' style={{ overflowX: 'hidden' }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      <form onSubmit={(event) => handleSubmitCompra(event, compra.total_compra, precio)}>
        <div className='contenido-' >
          <div className='formulario'>
            <div>
              <h1 id="titulo">Compras</h1>
            </div>
            <br />
            <div className='inputs-up'>
              <div className='contenedor-input' >
                <label style={{ marginLeft: "20px" }} htmlFor="fechaCompra"> Fecha</label>
                <input
                  id="fechaCompra"
                  name="fecha_compra"
                  className="input-field"
                  value={compra.fecha_compra}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
              <div className='contenedor-input'>
                <label style={{ marginLeft: "30px" }} htmlFor="numeroCompra"> Número</label>
                <input
                  id="numeroCompra"
                  name="numero_compra"
                  className="input-field3"
                  value={compra.nombre_compra}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="000"
                  style={{ marginLeft: "30px" }}
                />
              </div>
            </div>
            <br />
            <div id="kaka">
              <label style={{ marginLeft: "20px" }} htmlFor="proveedor"><i className="fa-solid fa-users iconosRojos select"></i> Proveedor </label>
              <select
                id="proveedor"
                name="id_proveedor"
                className="input-field2"
                value={compra.id_proveedor}
                onChange={handleInputChange}>
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.nombre_proveedor}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className='inputs-up'>
              <div className='contenedor-input' >
                <label style={{ marginLeft: "20px" }} htmlFor="precioCompra"><i className="fa-sharp fa-solid fa-dollar-sign iconosRojos"></i> Total </label>
                <input
                  id="precioCompra"
                  name="total_compra"
                  className="input-field4"
                  value={precioTotal || ''}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="0"
                  readOnly={true}
                  style={{
                    backgroundColor: '#E4E4E4',
                    color: '#999'
                  }}
                />
              </div>
              <div className='contenedor-input'>
                <button className='boton azulado2' type="button" onClick={addTableRow}><center>+ Insumo</center></button>
              </div>
            </div>
            <br />
          </div>
          <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid black' }} />
          <div className='tabla-detalle' style={{ overflowY: scrollEnabled ? 'scroll' : 'auto', maxHeight: '390px' }}>
            <table className="tablaDT ui celled table" style={{ width: "90%" }} ref={tableRef}>
              <thead className="rojo thead-fixed">
                <tr>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-font "></i > Nombre Insumo</th>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i> Precio</th>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i> Cantidad</th>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i></th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      <select className="input-field-tabla"  value={row.nombre} onChange={(e) => handleSelectChange(e, index)}>
                        <option value="">Seleccione un insumo</option>
                        {filteredInsumos.map((insumo) => (
                          <option key={insumo.id_insumo} value={insumo.nombre_insumo}>
                            {insumo.nombre_insumo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td  style={{ textAlign: "center" }}><input className="input-field-tabla" style={{ width: "100px" }} type="number" onChange={(e) => handlePrecioChange(e, index)} /></td>
                    <td style={{ textAlign: "center" }}><input className="input-field-tabla" style={{ width: "100px" }} type="number" onChange={(e) => handleCantidadChange(e, index)} /></td>
                    {index !== 0 && (
                      <td style={{ textAlign: "center" }}><button className='bot-x' onClick={() => handleDeleteRow(index)}>X</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <br />
        <div style={{ marginRight: "200px" }} className="cajaBotones">
          <button type="submit" id="can" className="boton azulado"><center>Guardar</center></button>
          <button  type="button" className="boton gris" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
export default App;

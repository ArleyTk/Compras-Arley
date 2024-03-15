import React, { useState, useEffect, useRef } from 'react';
import './registroCompras.css';
import { Outlet, Link } from "react-router-dom";
import { Table, Pagination } from 'react-bootstrap';

function App() {
  const [insumos, setInsumos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [precio, setPrecio] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [compra, setCompra] = useState({
    id_compra: '',
    nombre_compra: '',
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
    }
  };
  const filteredInsumos = insumos.filter(insumo =>
    insumo.nombre_insumo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectChange = (event, index) => {
    const { value } = event.target;
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        const selectedInsumo = insumos.find(insumo => insumo.nombre_insumo === value);
        return { ...row, nombre: value, insumoId: selectedInsumo.id_insumo };
      }
      return row;
    });

    setTableRows(updatedRows);
  };

  const handleCantidadChange = (event, index) => {
    const { value } = event.target;
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        return { ...row, cantidad: value, cantidad_seleccionada: parseFloat(value) || 0 };
      }
      return row;
    });
    setTableRows(updatedRows);
  };



  const handleSubmitCompra = async (event, totalCompra, precio) => {
    event.preventDefault();

    try {

      const totalCompra = tableRows.reduce((total, row) => total + parseFloat(row.precio_unitario || 0), 0);

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
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />


          <div className="contenido2">
            <br />
                <h1 id="titulo-2"> Registrar Compra</h1>
                <br />
                <br />
            <form onSubmit={(event) => handleSubmitCompra(event, compra.total_compra, precio)}>
              <div id="contenedorcito">
                <div className="input-container">
                  <div className='inputs-up'>
                    <br />
                    <div id="kake">
                      <label htmlFor="nombreCompra"><i className="fa-solid fa-font iconosRojos"></i> Nombre </label>
                      <input
                        id="nombreCompra"
                        name="nombre_compra"
                        className="input-field"
                        value={compra.nombre_compra}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Ingrese el nombre de la compra"
                      />
                    </div>
                    <br />
                    <div id="kaka">
                      <label htmlFor="precioCompra"><i className="fa-sharp fa-solid fa-dollar-sign iconosRojos"></i> Precio </label>
                      <input
                        id="precioCompra"
                        name="total_compra"
                        className="input-field2"
                        value={precioTotal || ''}
                        onChange={handleInputChange}
                        type="number"
                        placeholder=""
                        readOnly={true}
                        style={{
                          backgroundColor: '#E4E4E4',
                          color: '#999'
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <br />
                  <div className='inputs-down'>
                    <div id="kake">
                      <label htmlFor="fechaCompra"><i className="fa-solid fa-calendar-week iconosRojos"></i> Fecha</label>
                      <input
                        id="fechaCompra"
                        name="fecha_compra"
                        className="input-field"
                        value={compra.fecha_compra}
                        onChange={handleInputChange}
                        type="date"
                        placeholder="Ingrese la fecha de la compra"
                      />
                    </div>
                    <br />
                    <div id="kaka">
                      <label htmlFor="proveedor"><i className="fa-solid fa-users iconosRojos select"></i> Proveedor </label>
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
                  </div>
                </div>
              </div>
              <center>
                <br />
              </center>
              <table className="tablaDT ui celled table" style={{ borderRadius: "10px", width: "80%" }} ref={tableRef}>
                <thead className="rojo">
                  <tr>
                    <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white"  }}><i className="fa-solid fa-font "></i > Nombre Insumo</th>
                    <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i> Precio</th>
                    <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i> Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={index}>
                      <td style={{textAlign: "center",}}>
                        <select value={row.nombre} onChange={(e) => handleSelectChange(e, index)}>
                          <option value="">Seleccione un insumo</option>
                          {filteredInsumos.map((insumo) => (
                            <option key={insumo.id_insumo} value={insumo.nombre_insumo}>
                              {insumo.nombre_insumo}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{textAlign: "center",}}><input type="number" onChange={(e) => handlePrecioChange(e, index)} /></td>
                      <td style={{textAlign: "center",}}><input type="number" onChange={(e) => handleCantidadChange(e, index)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <center>
              <button style={{marginRight:"180px"}} className='boton azulado' type="button" onClick={addTableRow}>Añadir Insumo</button>
              </center>
              <div style={{marginRight:"170px"}} className="cajaBotones">
                <button type="submit" id="can" className="boton azulado"><center>Guardar</center></button>
                <div className="espacioEntreBotones"></div>
                <Link to={'/Compra'}>
                  <div className="registrarCompras">
                    <button className="boton gris">Cancelar</button>
                  </div>
                </Link>
              </div>
            </form>
            <br />
          </div>
    </>
  );
}
export default App;

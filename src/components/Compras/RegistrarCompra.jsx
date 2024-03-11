import React, { useState, useEffect, useRef } from 'react';
import './registroCompras.css';
import { Outlet, Link } from "react-router-dom";
import { Table, Pagination } from 'react-bootstrap';


function App() {
  let IDCOMPRADETALLLE = 0;
  const [insumos, setInsumos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (name === 'search') {
      setSearchTerm(value);
    } else {
      setCompra({ ...compra, [name]: value });
    }
  };
  const filteredInsumos = insumos.filter(insumo =>
    insumo.nombre_insumo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const handleCantidadChange = (event, insumoId) => {
    const { value } = event.target;
  
    const updatedInsumos = insumos.map(insumo => {
      if (insumo.id_insumo === insumoId) {
        return { ...insumo, cantidad: value };
      }
      return insumo;
    });
  
    setInsumos(updatedInsumos);
  };
  

  const handleSubmitCompra = async (event) => {
    event.preventDefault();

    try {
      const responseCompra = await fetch('http://localhost:8082/compras/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
      });

      if (!responseCompra.ok) {
        console.error('Error al enviar los datos de la compra');
        return;
      }

      const compraData = await responseCompra.json();
      const id_compra_d = compraData.id_compra;
      IDCOMPRADETALLLE = id_compra_d;
      console.log('Compra registrada correctamente:', compraData, "id_compra: ", IDCOMPRADETALLLE);

      const insumosSeleccionados = insumos.filter(insumo => insumo.seleccionado);

      if (insumosSeleccionados.length === 0) {
        console.error('Debe seleccionar al menos un insumo');
        return;
      }

      const comprasInsumosPromises = insumosSeleccionados.map(async (insumo) => {

        if (!insumo.cantidad || !insumo.precio_unitario) {
          console.error('La cantidad y el precio del insumo deben estar llenos');
          return;
        }

        const comprasInsumosData = {
          cantidad_insumo_compras_insumos: insumo.cantidad,
          precio_insumo_compras_insumos: insumo.precio_unitario,
          id_compra: IDCOMPRADETALLLE,
          id_insumo: insumo.id_insumo
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

  const handleInsumoChange = (event, insumoId) => {
    console.log(`Insumo seleccionado: ${insumoId}`);
    const updatedInsumos = insumos.map(insumo => {
      if (insumo.id_insumo === insumoId) {
        return { ...insumo, seleccionado: event.target.checked };
      }
      return insumo;
    });

    setInsumos(updatedInsumos);
  };


  const handlePrecioChange = (event, insumoId) => {
    const { value } = event.target;

    const updatedInsumos = insumos.map(insumo => {
      if (insumo.id_insumo === insumoId) {
        return { ...insumo, precio_unitario: value };
      }
      return insumo;
    });

    setInsumos(updatedInsumos);

    const totalCompra = updatedInsumos.reduce((total, insumo) => {
      if (insumo.seleccionado) {
        return total + (parseFloat(insumo.precio_unitario) || 0);
      }
      return total;
    }, 0);
    setCompra({ ...compra, total_compra: totalCompra });
  };


  if (isLoading) {
    return <div>Cargando la api, espere por favor...</div>;
  }

  // Lógica para calcular los insumos actuales según la página actual
  const indexOfLastInsumo = currentPage * insumosPerPage;
  const indexOfFirstInsumo = indexOfLastInsumo - insumosPerPage;
  const currentInsumos = filteredInsumos.slice(indexOfFirstInsumo, indexOfLastInsumo);
  
  // Lógica para generar números de página
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredInsumos.length / insumosPerPage); i++) {
    pageNumbers.push(i);
  }
  
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      <div className="contenedor">
        <div className="contenido">
          <div className="contenido2">
            <br />
            <br />
            <center>
              <div id="titulo">
                <h1>Registrar Compra</h1>
              </div>
            </center>
            <br />
            <br />
            <br />
            <form onSubmit={handleSubmitCompra}>
              <div id="contenedorcito">
                <div className="input-container">
                  <div className='inputs-up'>

                    <br />
                    <div id="kake">
                      <label htmlFor="nombreCompra"><i className="fa-solid fa-font iconosRojos"></i> Nombre Compra </label>
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
                      <label htmlFor="precioCompra"><i className="fa-sharp fa-solid fa-dollar-sign iconosRojos"></i> Precio Compra </label>
                      <input
                        id="precioCompra"
                        name="total_compra"
                        className="input-field2"
                        value={compra.total_compra || ''}
                        onChange={handleInputChange}
                        type="number"
                        placeholder=""
                        readOnly={true}
                        style={{
                          backgroundColor: '#E4E4E4',
                          color: '#999' //
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <br />
                  <div className='inputs-down'>


                    <div id="kake">
                      <label htmlFor="fechaCompra"><i className="fa-solid fa-calendar-week iconosRojos"></i> Fecha Compra </label>
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
                        onChange={handleInputChange}
                      >
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
              <input
                type="text"
                placeholder="Buscar insumo..."
                value={searchTerm}
                name="search"
                onChange={handleInputChange}
              />
              </center>
              <table className="tablaDT ui celled table" style={{ width: "100%" }} ref={tableRef}>
                <thead className="rojo">
                  <tr>
                    <th style={{ backgroundColor: '#E12424', color: "white", border: "1px solid gray" }}><i className="fa-solid fa-key "></i> Id</th>
                    <th style={{ backgroundColor: '#E12424', color: "white", border: "1px solid gray" }}><i className="fa-solid fa-font "></i > Nombre Insumo</th>
                    <th style={{ backgroundColor: '#E12424', color: "white", border: "1px solid gray" }}><i className="fa-solid fa-cart-plus "></i> Cantidad</th>
                    <th style={{ backgroundColor: '#E12424', color: "white", border: "1px solid gray" }}><i className="fa-solid fa-coins "></i> Precio</th>
                    <th style={{ backgroundColor: '#E12424', color: "white", border: "1px solid gray" }}><i className="fa-solid fa-check"></i> Selección</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInsumos.map((insumo, index) => (
                    <tr key={insumo.id_insumo} style={{ backgroundColor: "white", color: "black" }}>
                      <td style={{ backgroundColor: '#FDF4F470', border: "1px solid gray" }}>{insumo.id_insumo}</td>
                      <td style={{ backgroundColor: '#F4FBFD71', border: "1px solid gray" }}>{insumo.nombre_insumo}</td>
                      <td style={{ backgroundColor: '#FDF4F470', border: "1px solid gray" }}>
                        <input
                          type="number"
                          style={{ width: "100px" }}
                          value={insumo.cantidad}
                          onChange={(event) => handleCantidadChange(event, insumo.id_insumo)}
                        />
                      </td>
                      <td style={{ backgroundColor: '#F4FBFD71', border: "1px solid gray" }}>
                        <input
                          type="number"
                          style={{ width: "100px" }}
                          value={insumo.precio_unitario}
                          onChange={(event) => handlePrecioChange(event, insumo.id_insumo)}
                        />
                      </td>
                      <td style={{ backgroundColor: '#FDF4F470', border: "1px solid gray" }}>
                        <input
                          type="checkbox"
                          onChange={(event) => handleInsumoChange(event, insumo.id_insumo)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <center>
                <Pagination>
                  <Pagination.Prev onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} />
                  {pageNumbers.map(number => (
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                      {number}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)} />
                </Pagination>
              </center>
              <div className="cajaBotones">
                <button type="submit" id="can" className="vinotinto">Guardar</button>
                <div className="espacioEntreBotones"></div>
                <Link to={'/Compra'}>
                  <div className="registrarCompras">
                    <button className="boton rojovivo">Cancelar</button>
                  </div>
                </Link>
              </div>
            </form>
            <br />
          </div>
          <br />
        </div>
      </div>
    </>
  );
}

export default App;

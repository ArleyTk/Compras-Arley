import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';
import './registroCompras.css';
import { Link } from "react-router-dom";


function TablaCompras() {
  const [compras, setCompras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchCompras();
  }, []);

  useEffect(() => {
    if (compras.length > 0) {
      setIsLoading(false);
    }
  }, [compras]);

  const handleEstadoCompra = async (idCompra, estadoCompra, compra) => {
    try {
      const nuevoEstadoCompra = estadoCompra === 1 ? 2 : 1;
      const response = await fetch(`http://localhost:8082/compras/compras/${idCompra}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...compra, // Mantener todos los datos de la compra
          estado_compra: nuevoEstadoCompra // Cambiar solo el estado de la compra
        })
      });

      if (response.ok) {
        // Actualización exitosa, actualizar la lista de compras
        fetchCompras();
      } else {
        console.error('Error al actualizar el estado de la compra');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la compra:', error);
    }
  };

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
        dom: '<"data-table-filter"f>tpil',
        language: {
          paginate: {
            first: '<<',
            previous: '<',
            next: '>',
            last: '>>',
          },
          search: ''
        },
        initComplete: function () {
          $('.data-table-filter input').css({
            'width': '1000px',
            'max-width': '400px',
            'height': '30px',
            'font-size': '14px',
            'margin-right': '600px',
            'border-radius': '50px',
            'padding-left': '30px', // Espacio para el icono
          }).before('<i class="fa fa-search" style="position: relative; left: 10px; top: 20%; transform: translateY(180%);"></i>');
          // Ajustamos la posición del icono para que quede alineado verticalmente
          $('.dataTables_length').hide();
        }
      });
    }
  }, [compras, isLoading]);


  const fetchCompras = async () => {
    try {
      const response = await fetch('http://localhost:8082/compras/compras');
      if (response.ok) {
        const data = await response.json();
        setCompras(data);
      } else {
        console.error('Error al obtener las compras');
      }
    } catch (error) {
      console.error('Error al obtener las compras:', error);
    }
  };

  const handleDeleteCompra = async (idCompra) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
      try {
        const response = await fetch(`http://localhost:8082/compras/compras/${idCompra}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Eliminación exitosa, actualizar la lista de compras
          fetchCompras();
        } else {
          console.error('Error al eliminar la compra');
        }
      } catch (error) {
        console.error('Error al eliminar la compra:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
      <div className='inicio'>
        <h1 id="titulo">Compras</h1>
        <div className="botones">
          <Link to={'/registrarCompra'}>
            <button className="boton vinotintov2" id="botonagr"> <i className=".fa-solid fa-plus"></i> Agregar</button>
          </Link>
          <button style={{backgroundColor: "#1F67B9", color: "white"}} className="boton descargar"><i className="fa-solid fa-download"  > </i></button>

        </div>
      </div>

        <div className="tabla">
          <table className="display" style={{ width: "100%" }} ref={tableRef}>
            <thead style={{ backgroundColor: "red" }}>
              <tr>
                <th style={{ textAlign: 'center' }}> <i className={["fa-solid fa-key iconosRojos"]}></i> ID</th>
                <th style={{ textAlign: 'center' }}> <i className={["fa-solid fa-font iconosRojos"]}></i> Nombre</th>
                <th style={{ textAlign: 'center' }}> <i className={["fa-solid fa-calendar-days iconosRojos"]}></i> Fecha</th>
                <th style={{ textAlign: 'center' }}> <i className={["fa-solid fa-coins iconosRojos"]}></i> Total</th>
                <th style={{ textAlign: 'center' }}> <i className={["fa-solid fa-user iconosRojos"]}></i> ID Proveedor</th>
                <th style={{ textAlign: 'center' }}> <i className={["fa-solid fa-lightbulb iconosRojos"]}></i> Estado</th>
                <th style={{ textAlign: 'center' }}> <i className={["fa-solid fa-gear iconosRojos"]}></i> Funciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map(compra => (
                <tr key={compra.id_compra} style={{ backgroundColor: "white", color: "black" }}>
                  <td style={{ textAlign: 'center' }}>{compra.id_compra}</td>
                  <td style={{ textAlign: 'center' }}>{compra.nombre_compra}</td>
                  <td style={{ textAlign: 'center' }}>{new Date(compra.fecha_compra).toLocaleDateString('es-ES')}</td>
                  <td style={{ textAlign: 'center' }}>{compra.total_compra}</td>
                  <td style={{ textAlign: 'center' }}>{compra.id_proveedor}</td>
                  <td onClick={() => handleEstadoCompra(compra.id_compra, compra.estado_compra, compra)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '30px' }}>
                    {compra.estado_compra === 1 ? (
                      <i className="bi bi-toggle-on" style={{ color: "#1F67B9" }}></i>
                    ) : (
                      <i className="bi bi-toggle-off" style={{ color: "black" }}></i>
                    )}
                  </td>

                  <td>
                    <center>
                      <button className="boton" style={{ backgroundColor: "white" }} onClick={() => handleDeleteCompra(compra.id_compra)}>
                        <i className="fas fa-trash" style={{ color: "gray" }}></i>
                      </button>
                    </center>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>




    </>
  );
}

export default TablaCompras;

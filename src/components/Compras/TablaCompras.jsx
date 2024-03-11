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
          search: 'Buscar'
        },
        initComplete: function () {
          $('.data-table-filter input').css({
            'width': '1000px',
            'max-width': '400px',
            'height': '30px',
            'font-size': '14px',
            'margin-right': '600px',
          });
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
        const response = await fetch(`http://localhost:4000/luchosoft/compras/${idCompra}`, {
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
      <div className="contenedor">
        <div className="contenido">
          <center>
            <div id="titulo">
              <h1 id= "titulo">Gestión de Compras</h1>
            </div>
          </center>
          <div class="botones">
            <Link to={'/registrarCompra'}>
              <button className="boton rojovivo" id="botonagr"> <i className=".fa-solid fa-plus"></i> Agregar</button>
            </Link>
            <button className="boton vinotintov2"><i className="fa-solid fa-file-pdf" ></i> Generar reporte</button>

          </div>
          <br />
          <br />
          <br />
          <div className="tabla">
            <table className="display" style={{ width: "100%" }} ref={tableRef}>
              <thead style={{ backgroundColor: "red" }}>
                <tr>
                  <th><i className={["fa-solid fa-key iconosRojos"]}></i> ID</th>
                  <th> <i className={["fa-solid fa-font iconosRojos"]}></i> Nombre</th>
                  <th> <i className={["fa-solid fa-calendar-days iconosRojos"]}></i> Fecha</th>
                  <th> <i className={["fa-solid fa-coins iconosRojos"]}></i> Total</th>
                  <th> <i className={["fa-solid fa-user iconosRojos"]}></i> ID Proveedor</th>
                  <th> <i className={["fa-solid fa-lightbulb iconosRojos"]}></i> Estado</th>
                  <th> <i className={["fa-solid fa-hand-middle-finger iconosRojos"]}></i> Funciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map(compra => (
                  <tr key={compra.id_compra} style={{ backgroundColor: "white", color: "black" }}>
                    <td>{compra.id_compra}</td>
                    <td>{compra.nombre_compra}</td>
                    <td>{compra.fecha_compra}</td>
                    <td>{compra.total_compra}</td>
                    <td>{compra.id_proveedor}</td>
                    <td>{compra.estado_compra}</td>
                    <td>
                      <center>
                        <button className="boton" style={{ backgroundColor: "white" }} onClick={() => handleDeleteCompra(compra.id_compra)}>
                          <i className="fas fa-trash iconosRojos"></i>
                        </button>
                      </center>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </>
  );
}

export default TablaCompras;

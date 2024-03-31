import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import About from './components/About';
import Home from './components/Home';
import Default from './components/Default';
import Dashboard from './components/Dashboard';
import Usuarios from './components/Usuarios/Usuarios';
import Roles from './components/Configuracion/Roles';
import AgregarRoles from './components/Configuracion/AgregarRoles';
import AgregarUsuarios from './components/Usuarios/AgregarUsuarios';
import RegistrarCompra from './components/Compras/Compras/RegistrarCompra';
import TablaCompras from './components/Compras/Compras/TablaCompras';
import TablaProveedores from './components/Compras/Proveedores/TablaProveedores';
import TablaInsumos from './components/Compras/Insumos/TablaInsumos';
import RegistrarInsumo from './components/Compras/Insumos/RegistrarInsumo';
import EditarInsumo from './components/Compras/Insumos/EditarInsumo';
import TablaCatInsumos from './components/Compras/Cat-Insumos/TablaCatInsumos';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/usuarios" element={<Usuarios />}/>
          <Route path="/agregarUsuarios" element={<AgregarUsuarios />}/>
          <Route path="/roles" element={<Roles />}/>
          <Route path="/agregarRoles" element={<AgregarRoles />}/>
          <Route path="/RegistrarCompra" element={<RegistrarCompra />}/>
          <Route path="/Compra" element={<TablaCompras />}/>
          <Route path="/Proveedores" element={<TablaProveedores />}/>
          <Route path="/Insumos" element={<TablaInsumos />}/>
          <Route path="/CatInsumos" element={<TablaCatInsumos />}/>
          <Route path="/RegistrarInsumo" element={<RegistrarInsumo />}/>
          <Route path="/EditarInsumo/:id_insumo" element={<EditarInsumo />}/>

          <Route path="*" element={<Default />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App

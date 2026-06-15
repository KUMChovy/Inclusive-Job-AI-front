

import { Routes, Route } from 'react-router-dom';

// ── Páginas públicas ─────────────────────────────────────────
import Home        from './pages/Home.jsx';
import LoginAdmin  from './pages/Admin/LoginAdmin.jsx';
import Vista from './pages/Reclutador/vista.jsx';
import Login from './pages/Ingresar.jsx';
import Registro from './pages/Registro.jsx';
import Verificacion from './pages/Verificacion.jsx';

// ── Admin ────────────────────────────────────────────────────
import AdminLayout    from './assets/Componentes/Admin/AdminLayout.jsx';
import Dashboard      from './pages/Admin/Dashboard.jsx';
import Empresas       from './pages/Admin/Empresas.jsx';
import EmpresaDetalle from './pages/Admin/Empresadetalle.jsx';
import Usuarios       from './pages/Admin/Usuarios.jsx';
import UsuarioPerfil  from './pages/Admin/Usuarioperfil.jsx';
import Vacantes       from './pages/Admin/Vacantes.jsx';
import VacanteDetalle from './pages/Admin/Vacantedetalle.jsx';
import Postulaciones  from './pages/Admin/Postulaciones.jsx';
import PostulacionDetalle from './pages/Admin/Postulaciondetalle.jsx';
import Discapacidades from './pages/Admin/Discapacidades.jsx';
import Reportes       from './pages/Admin/Reportes.jsx';
// import Configuracion from './pages/Admin/Configuracion.jsx';

// ── Reclutador ───────────────────────────────────────────────
import ReclutadorDashboard from './pages/Reclutador/Reclutadordashboard.jsx';


// ── Postulante ───────────────────────────────────────────────
import PostulanteDashboard from './pages/Postulante/Postulantedashboard.jsx';
import Formulario          from './pages/Postulante/formulario.jsx';
import Certificaciones from './pages/Postulante/Certificaciones.jsx';


function App() {
  return (
    <Routes>

      {/* ── Públicas ── */}
      <Route path="/"            element={<Home />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route path='/Vista' element={<Vista/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/registro' element={<Registro/>}/>
      <Route path="/verificacion" element={<Verificacion />} />

      {/* ================================================================
          ADMIN 
          ================================================================ */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index                 element={<Dashboard />} />
        <Route path="empresas"       element={<Empresas />} />
        <Route path="empresas/:id"   element={<EmpresaDetalle />} />
        <Route path="usuarios"       element={<Usuarios />} />
        <Route path="usuarios/:id"   element={<UsuarioPerfil />} />
        <Route path="vacantes"       element={<Vacantes />} />
        <Route path="vacantes/:id"   element={<VacanteDetalle />} />
        <Route path="postulaciones"  element={<Postulaciones />} />
        <Route path="postulaciones/:id" element={<PostulacionDetalle />} />
        <Route path="discapacidades" element={<Discapacidades />} />
        <Route path="reportes"       element={<Reportes />} />
        {/* <Route path="configuracion" element={<Configuracion />} /> */}
      </Route>

      {/* ================================================================
          RECLUTADOR 
          ================================================================ */}
      <Route path="/reclutador" element={<ReclutadorDashboard />} />

      {/* <Route path="/reclutador/empresa"      element={<ReclutadorEmpresa />} /> */}
  

      {/* ================================================================
          POSTULANTE  
          ================================================================ */}
      <Route path="/postulante" element={<PostulanteDashboard />} />
      <Route path="/formulario" element={<Formulario />} />
      <Route path="/postulante/certificaciones" element={<Certificaciones />} />
      {/* <Route path="/postulante/vacantes"        element={<PostulanteVacantes />} /> */}
    


    </Routes>


  );
}

export default App;

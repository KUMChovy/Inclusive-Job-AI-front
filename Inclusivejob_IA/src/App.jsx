import { Routes, Route, Link } from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Login from './login/login.jsx';
import Postulante from './pages/Postulante/postulante.jsx';
//import Rp from './components/Rp.jsx';
import EditarPerfil from './pages/Postulante/EdicionPerfil';
import ChatBot from './pages/Reclutador/ChatBot.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/postulante' element={<Postulante/>}/>
        <Route path='/Rp' element={<EditarPerfil/>}/>

      </Routes>
    </div>
  );
}
export default App
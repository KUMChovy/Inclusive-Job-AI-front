import { Routes, Route, Link } from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Login from './login/login.jsx';
import Postulante from './pages/Postulante/postulante.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/postulante' element={<Postulante/>}/>
      </Routes>
    </div>
  );
}
export default App
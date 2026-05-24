import { Routes, Route, Link } from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Login from './login/login.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </div>
  );
}
export default App
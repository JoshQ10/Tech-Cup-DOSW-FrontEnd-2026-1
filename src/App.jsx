import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import PerfilDeportivo from './pages/PerfilDeportivo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/seleccionar-rol" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/perfil-deportivo" element={<PerfilDeportivo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

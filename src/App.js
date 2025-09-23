import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Ofertas from './pages/Ofertas';
import ProductosCategoria from './pages/ProductosCategoria';
import FormScraping from './pages/FormScraping';
import ContenidoScraping from './pages/ContenidoScraping';
import Carrito  from './pages/Carrito';
import Comparador from './pages/Comparador'
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/productos/:subcategoriaId" element={<ProductosCategoria />} />
        {/* Otras rutas */}
        <Route path="/comparar/:idSubcategoria" element={<HomePage />} />
        <Route path="/formscraping" element={<FormScraping/>} />
        <Route path="/contenidoscraping" element={<ContenidoScraping/>} />
        <Route path="/Carrito" element={<Carrito/>}/>
        <Route path="/Comparador" element={<Comparador/>} />
      </Routes>
    </Router>
  );
};

export default App;

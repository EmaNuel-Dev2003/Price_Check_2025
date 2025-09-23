import React, { useState, useEffect } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCarrito } from '../context/CarritoContext';
import { motion, useAnimation } from 'framer-motion';
import { CiLogout } from "react-icons/ci"; //Simbolo de Logout
import { GrPowerShutdown } from "react-icons/gr"; //Simbolo de apagado
import { FiDownload } from "react-icons/fi"; //Simbolo de descarga
import { LiaShoppingCartSolid } from "react-icons/lia"; // Icono carrito
import { FaCircle } from "react-icons/fa6";
import { MdShoppingCart } from "react-icons/md";
import { Badge } from "@mui/material";


const HeaderBubble = () => {
  const [categorias, setCategorias] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [currentSubcategories, setCurrentSubcategories] = useState([]);
  const [user, setUser] = useState(null);
  const { totalCarrito } = useCarrito();
  const navigate = useNavigate();
  const controls = useAnimation();

  // Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5001/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Manejo de menús
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenSubMenu = (event, subcategories) => {
    setSubMenuAnchorEl(event.currentTarget);
    setCurrentSubcategories(subcategories);
  };
  const handleCloseSubMenu = () => setSubMenuAnchorEl(null);

  // Redirigir a los productos de la subcategoría
  const handleNavigate = (subcategoriaId) => {
    navigate(`/productos/${subcategoriaId}`);
    handleCloseMenu();
    handleCloseSubMenu();
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // Redirigir al login
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '0.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        gap: "0.5rem", // Espaciado uniforme entre elementos
      }}
    >
      <Link to="/HomePage" style={{ textDecoration: 'none' }}>
        <Button variant="text" color="primary">Home</Button>
      </Link>
      <Link to="/ofertas" style={{ textDecoration: 'none' }}>
        <Button variant="text" color="primary">Ofertas</Button>
      </Link>

      <Button variant="text" color="primary" onClick={handleOpenMenu}>Categorías</Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {categorias.map((categoria) => (
          <MenuItem key={categoria.id} onClick={(event) => handleOpenSubMenu(event, categoria.subcategorias)}>
            {categoria.nombre}
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={subMenuAnchorEl} open={Boolean(subMenuAnchorEl)} onClose={handleCloseSubMenu}>
        {currentSubcategories.map((subcategoria) => (
          <MenuItem key={subcategoria.id} onClick={() => handleNavigate(subcategoria.id)}>
            {subcategoria.nombre}
          </MenuItem>
        ))}
      </Menu>

      <Link to="/Carrito" style={{ textDecoration: "none" }}>
      <Badge
        badgeContent={totalCarrito}
        color="error"
        sx={{
          "& .MuiBadge-badge": {
            fontSize: "10px",
            fontWeight: "bold",
            padding: "6px",
            minWidth: "16px",
            height: "16px",
            borderRadius: "50%",
          },
        }}
      >
        
        <MdShoppingCart   size={40} sx={{ fontSize: 20, marginLeft: '30px'}} />
      </Badge>
    </Link>

      <Link to="/formscraping" style={{ textDecoration: 'none' }}>
        <Button variant="text" color="primary">Extraer</Button>
      </Link>

      {user ? (
         
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Typography variant="text" sx={{ mr: 2 }} fontSize={"14pt"}>Hola,{user.name}</Typography>
          <Button  color="primary" onClick={handleLogout} sx={{  padding: '5px 10px' }}><GrPowerShutdown size={25} /> </Button>
        </Box>
        
      ) : (
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">Login</Button>
        </Link>
      )}
    </Box>
  );
};

export default HeaderBubble;

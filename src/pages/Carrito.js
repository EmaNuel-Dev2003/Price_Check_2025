import React, { useState } from 'react';
import HeaderBubble from '../components/HeaderBubble';
import Footer from '../components/Footer';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext'; // Importar el contexto

const Carrito = () => {
  const { productos, totalCarrito, agregarAlCarrito, restarDelCarrito } = useCarrito();
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Mapeo de IDs de supermercados a nombres
  const supermercados = {
    21: "Tienda Inglesa",
    22: "Tata",
  };

  const compararProductos = async () => {
    if (productos.length === 0) {
      setMensaje("El carrito está vacío.");
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const response = await fetch('http://localhost:5001/guardar-carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/comparador', {
          state: {
            productos: data.resultados,
            costoTotalCarrito: data.costoTotalCarrito || 0,
            costoTotalSimilares: data.costoTotalSimilares || 0
          }
        });
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje('Error al conectar con el servidor');
    }

    setCargando(false);
  };
  
  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', padding: '2rem' }}>
      <HeaderBubble />

      <div style={{ marginTop: '5rem', marginBottom: '5rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Carrito de Compras</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {productos.length > 0 ? (
            productos.map((producto) => (
              
              <div key={producto.id} className="tarjeta-producto" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
                <img src={producto.img} alt={producto.nombre} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                <h3>{producto.nombre}</h3>
                <p>{`Precio: $${producto.precio}`}</p>
                <p>{`Supermercado: ${supermercados[producto.idSupermercado] || 'Desconocido'}`}</p>
                {producto.URL && (
                  <p>
                    URL: <a href={producto.URL} target="_blank" rel="noopener noreferrer">{producto.URL}</a>
                  </p>
                )}
                 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  <Button variant="outlined" onClick={() => restarDelCarrito(producto)}>-</Button>
                  <span className="cantidad">{producto.cantidad}</span>
                  <Button variant="outlined" onClick={() => agregarAlCarrito(producto)}>+</Button>
                </div>
              </div>
            ))
          ) : (
            <Typography>No hay productos en el carrito.</Typography>
          )}
          
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h6">Totales:</Typography>
          <Typography>{`Unidades: ${totalCarrito}`}</Typography>
          <Typography>{`Precio Total: $${productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0)}`}</Typography>
        </div>

        <Button
          variant="contained"
          color="primary"
          disabled={productos.length === 0 || cargando}
          onClick={compararProductos}
          style={{ marginTop: '2rem' }}
        >
          {cargando ? <CircularProgress size={24} color="inherit" /> : "Comparar Precios"}
        </Button>

        {mensaje && <Typography color="error" style={{ marginTop: '1rem' }}>{mensaje}</Typography>}
      </div>
      <Footer />
    </Box>
  );
};

export default Carrito;

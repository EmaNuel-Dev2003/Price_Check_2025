import React, { useEffect, useState } from 'react';
import HeaderBubble from '../components/HeaderBubble';
import Footer from '../components/Footer';
import axios from 'axios';
import { Typography, Box, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';



const ContenidoScraping = () => {
  // Si no se envía nada, se puede establecer un valor por defecto o manejar el caso
  const location = useLocation();
  const { cantidad } = location.state || { cantidad: 0 };
  const { subcategoria } = location.state || { subcategoria: { label: 'No seleccionada' } };
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProductos, setTotalProductos] = useState(0); // Estado para la cantidad total de productos
  const [productosEliminados, setProductosEliminados] = useState(false); // Estado para saber si se eliminó algún producto


  // Mapeo de IDs de supermercados a nombres
  const supermercados = {
    21: "Tienda Inglesa",
    22: "Tata",
  };


  const formatFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para obtener la cantidad total de productos
  const fetchTotalProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5001/productos/cantidad');
      setTotalProductos(response.data.cantidad); // Establecer la cantidad total de productos
    } catch (err) {
      console.error('Error al obtener la cantidad de productos:', err);
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/productos/${id}`);
      setProductos(productos.filter(producto => producto.id !== id)); // Filtra el producto eliminado
       // Indicamos que se ha eliminado al menos un producto
       setProductosEliminados(true);
      fetchTotalProductos(); // Llamamos a la función para obtener la cantidad de productos
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('No se pudo eliminar el producto. Intenta nuevamente.');
    }
  };

  const eliminarTodosLosProductos = async () => {
    try {
      await axios.delete('http://localhost:5001/eliminarproductos');
      setProductos([]); // Vaciamos el estado de productos
      setProductosEliminados(true); // Indicamos que se han eliminado productos
      fetchTotalProductos(); // Actualizamos el total de productos
    } catch (err) {
      console.error('Error al eliminar todos los productos:', err);
      setError('No se pudieron eliminar los productos. Intenta nuevamente.');
    }
  };
  

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5001/productos/prueba'); // URL ajustada
        setProductos(response.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };




    fetchProductos();
    fetchTotalProductos(); // Llamamos a la función para obtener la cantidad de productos

  }, []);

  return (

    <Box
      sx={{
        bgcolor: '#f9f9f9',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <HeaderBubble />

      <div style={{ marginTop: '5rem', marginBottom: '5rem', textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>
          Productos Extraídos
        </Typography>
        <Typography variant="h6" fontWeight={'bold'}>
          Total de productos: {totalProductos} {/* Mostrar la cantidad total de productos */}
        </Typography>
        <Button
                      variant="outlined"
                      color="error"
                      sx={{ marginTop: '1rem' }}
                      onClick={() => eliminarTodosLosProductos()} // Asegúrate de que `producto.id` exista
                    >
                      Eliminar todos
                    </Button>
      {!productosEliminados && Number(cantidad)>totalProductos && (
        <>
        <Typography color='#2196f3'  variant="h6" marginTop={'1rem'} textAlign={'center'}> 
          No se pudo extraer la cantidad de productos seleccionada, porque la subcategoría "{subcategoria.label}", contiene un 
          máximo de {totalProductos} productos
        </Typography>
        </>
        
      )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Typography variant="body1">Cargando productos...</Typography>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>
          <Typography variant="h6">Error</Typography>
          <Typography variant="body1">{error}</Typography>
        </div>
      ) : (
        <Paper elevation={3} sx={{ padding: '1rem' }}>
          <Grid container spacing={3} justifyContent="center">
            {productos.map((producto, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <img
                      src={producto.img || 'https://via.placeholder.com/150'}
                      alt={producto.Nombre || 'Producto'}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {producto.Nombre || 'Sin nombre'}
                    </Typography>
                    <Typography variant="body2">
                      Precio: {producto.Precio ? `$${producto.Precio}` : 'No disponible'}
                    </Typography>
                    {/* Mostrar la fecha con formato */}
                    {producto.FechaIngreso && (
                      <Typography variant="body2">
                        Fecha Ingreso: {formatFecha(producto.FechaIngreso)}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      Supermercado: {supermercados[producto.idSupermercado]}
                    </Typography>


                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: '1rem' }}
                      onClick={() =>
                        producto.URL ? window.open(producto.URL, '_blank') : alert('Producto no disponible')
                      }
                      disabled={!producto.URL}
                    >
                      Ver Producto
                    </Button>
                    {/* Botón para eliminar el producto */}
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ marginTop: '1rem' }}
                      onClick={() => eliminarProducto(producto.id)} // Asegúrate de que `producto.id` exista
                    >
                      Eliminar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Footer />
    </Box>
  );
};

export default ContenidoScraping;

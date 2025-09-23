import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import Footer from '../components/Footer';
import { Button } from '@mui/material';
import HeaderBubble from '../components/HeaderBubble';

const Comparador = () => {
  const location = useLocation();
  const state = location.state || {};
  const productos = state.productos || [];
  const costoTotalCarrito = state.costoTotalCarrito ?? 0;
  const costoTotalSimilares = state.costoTotalSimilares ?? 0;

  const productosActualizados = productos.map((producto) => {
    const precioCarrito = Number(producto.productoCarrito?.precio) || Infinity;
    const precioSimilar = Number(producto.mejorCoincidencia?.precio) || Infinity;
    
  
    // Si no hay precios disponibles, tratamos de evitar comparaciones inválidas
    const esCarritoMasEconomico = precioCarrito && precioSimilar ? precioCarrito < precioSimilar : false;
    const esSimilarMasEconomico = precioCarrito && precioSimilar ? precioSimilar < precioCarrito : false;
  
    return {
      ...producto,
      productoCarrito: {
        ...producto.productoCarrito,
        esMasEconomico: esCarritoMasEconomico,  // Solo será true si el producto del carrito es más barato
      },
      mejorCoincidencia: producto.mejorCoincidencia
        ? {
            ...producto.mejorCoincidencia,
            esMasEconomico: esSimilarMasEconomico,  // Solo será true si el similar es más barato
          }
        : null,
    };
  });
  
  

  const esCarritoMasEconomico = costoTotalCarrito < costoTotalSimilares;

  return (
    
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', padding: '2rem'}}>
      <HeaderBubble />
      <Typography variant="h4" gutterBottom align="center"  marginBlockEnd={'2rem'}  marginTop={'5rem'}>
        Resultados
      </Typography>
      

      {productosActualizados.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {productosActualizados.map((producto, index) => (
            <Grid container item xs={12} md={8} key={index} spacing={2} alignItems="center">
              {/* Producto en el carrito */}
              <Grid item xs={6}>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    position: 'relative',
                    bgcolor: 'white', 
                  }}
                >
                  {producto.productoCarrito.esMasEconomico && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        backgroundColor: '#00796b',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Más económico
                    </Box>
                  )}

                  <Typography variant="h6">Producto seleccionado</Typography>
                  <img
                    src={producto.productoCarrito.img || 'https://via.placeholder.com/150'}
                    alt={producto.productoCarrito.nombre || 'Producto sin nombre'}
                    style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                  />
                  <Typography>{producto.productoCarrito.nombre || 'Producto sin nombre'}</Typography>
                  <Typography>{`Precio: $${producto.productoCarrito.precio || 'No disponible'}`}</Typography>
                  <Typography>{`Supermercado: ${producto.productoCarrito.nombreSupermercadoCarrito || 'Producto sin nombre'}`}</Typography>
                  <Typography>{`Cantidad: ${producto.productoCarrito.cantidad || 'No disponible'}`}</Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '1rem' }}
                    onClick={() =>
                      producto.productoCarrito.urlCarrito
                        ? window.open(producto.productoCarrito.urlCarrito, '_blank')
                        : alert('Producto no disponible')
                    }
                    disabled={!producto.productoCarrito.urlCarrito}
                  >
                    Ver Producto
                  </Button>
                </Box>
              </Grid>

              {/* Producto similar */}
              <Grid item xs={6}>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    position: 'relative',
                    bgcolor: 'white', 
                  }}
                >
                  {producto.mejorCoincidencia?.esMasEconomico && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        backgroundColor: '#00796b',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Más económico
                    </Box>
                  )}
                  <Typography variant="h6">Producto Similar</Typography>
                  {producto.mejorCoincidencia ? (
                    <>
                      <img
                        src={producto.mejorCoincidencia.imagen || 'https://via.placeholder.com/150'}
                        alt={producto.productoCarrito.nombre || 'Producto sin nombre'}
                        style={{ width: '179px', height: '179px', objectFit: 'contain' }}
                      />
                      <Typography>{producto.mejorCoincidencia.nombre}</Typography>
                      <Typography>{`Precio: $${producto.mejorCoincidencia.precio || 'No disponible'}`}</Typography>
                      <Typography>{`Supermercado: ${producto.mejorCoincidencia.nombreTienda || 'No disponible'}`}</Typography>
                      <Typography>{`Similitud: ${producto.mejorCoincidencia.similitud}`}</Typography>
                      <Typography>{`Cantidad: ${producto.productoCarrito.cantidad || 'No disponible'}`}</Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '1rem' }}
                        onClick={() =>
                          producto.mejorCoincidencia.urlSimilar
                            ? window.open(producto.mejorCoincidencia.urlSimilar, '_blank')
                            : alert('Producto no disponible')
                        }
                        disabled={!producto.mejorCoincidencia.urlSimilar}
                      >
                        Ver Producto
                      </Button>
                    </>
                  ) : (
                    <Typography>No se encontró un producto similar en el supermercado opuesto.</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center">No hay productos para comparar.</Typography>
      )}

      {/* Costo total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}   marginLeft={'-30rem'}>
        <Typography
          variant="h6"
          sx={{
            color: esCarritoMasEconomico ? '#00796b' : 'black',
            fontWeight: esCarritoMasEconomico ? 'bold' : 'normal',
          }}
        >
          {`Total Productos Seleccionados: $${costoTotalCarrito}`}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '-2rem' }} marginLeft={'45rem'} >
      <Typography
          variant="h6"
          sx={{
            color: !esCarritoMasEconomico ? '#00796b' : 'black',
            fontWeight: !esCarritoMasEconomico ? 'bold' : 'normal',
          }}  marginRight={'12rem'}
        >
          {`Total Productos Encontrados: $${costoTotalSimilares}`}
        </Typography>

      </Box>

      <Footer />
    </Box>
  );
};

export default Comparador;

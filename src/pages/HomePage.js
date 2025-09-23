import React, { useState, useContext } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import HeaderBubble from '../components/HeaderBubble';
import CarritoContext from '../context/CarritoContext'; // Importa el contexto
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [results, setResults] = useState([]); // Estado para los resultados
  const [loading, setLoading] = useState(false); // Estado para el cargando
  const [error, setError] = useState(null); // Estado para errores
  const [searched, setSearched] = useState(false); // Estado para determinar si se ha realizado una búsqueda
  const { agregarAlCarrito } = useContext(CarritoContext); // Accede a la función
  const [clickedProductId, setClickedProductId] = useState(null);


  const handleSearch = async () => {
    if (!searchTerm) {
      setError('Por favor, ingresa un término de búsqueda');
      return;
    }

    setError(null); // Limpiar errores previos
    setLoading(true); // Mostrar el estado de cargando
    setSearched(true); // Marcar que se ha realizado una búsqueda

    try {
      const response = await axios.get(
        `http://localhost:5001/productos/comparar?nombre=${searchTerm}` // URL de tu endpoint
      );
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al realizar la búsqueda. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false); // Ocultar el estado de cargando
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#f9f9f9',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <HeaderBubble />

      <div style={{ marginTop: '5rem', marginBottom: '5rem', textAlign: 'center' }}>
        {/* Barra de búsqueda */}
        <Typography variant="h4" gutterBottom>
          Comparador de Precios
        </Typography>
        <TextField
          label="Buscar producto"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '50%', marginBottom: '1rem' }}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>

        {/* Resultados */}
        {error && (
          <Typography color="error" style={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}

        {results.length > 0 && (
          <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}><strong>Imagen</strong></TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}><strong>Producto</strong></TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#f0f8ff', // Fondo azul claro
                      color: '#000', // Texto negro
                      fontWeight: 'bold',
                      fontSize: '1.3rem', // Tamaño de fuente más grande
                      textAlign: 'center',
                      padding: '16px',
                    }}
                  >
                    <strong>Precio</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}><strong>Supermercado</strong></TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: '16px' }}>
                      <img
                        src={product.img || 'https://via.placeholder.com/150'}
                        alt={product.producto}
                        style={{
                          width: '120px',  // Aumentar tamaño de la imagen
                          height: '120px',
                          objectFit: 'contain',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', padding: '16px' }}>{product.producto}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#f0f8ff',
                        fontWeight: 'bold',
                        fontSize: '1.8rem',
                        textAlign: 'center',
                        padding: '16px',
                      }}
                    >
                      ${product.Precio}
                    </TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', padding: '16px' }}>{product.supermercado}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.open(product.URL, '_blank')}
                        sx={{ marginRight: '10px' }}
                      >
                        Ver producto
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => agregarAlCarrito({
                          id: product.id,
                          nombre: product.producto,
                          precio: product.Precio,
                          img: product.img,
                          idSupermercado: product.idsupermercado,  
                          idSubcategoria: product.idSubcategoria,
                          url: product.URL
                        })}
                      >
                        Agregar al carrito
                      </Button>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        )}

        {/* Mostrar "No se encontraron resultados." solo si se ha buscado y no hay resultados */}
        {searched && results.length === 0 && !loading && !error && (
          <Typography variant="body1" sx={{ marginTop: '2rem' }}>
            No se encontraron resultados.
          </Typography>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HomePage;

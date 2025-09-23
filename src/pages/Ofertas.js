import React, { useState, useEffect, useContext } from 'react';
import HeaderBubble from '../components/HeaderBubble';
import Footer from '../components/Footer';
import axios from 'axios';
import CarritoContext from '../context/CarritoContext'; // Importa el contexto
import { Card, CardContent, Typography, Button, Box, Grid, Paper, TextField, Pagination } from '@mui/material';

const Ofertas = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 8; // Número de productos por página
  const { agregarAlCarrito } = useContext(CarritoContext); // Accede a la función
  const [clickedProductId, setClickedProductId] = useState(null);
  

  const supermercados = {
    21: "Tienda Inglesa",
    22: "Tata",
  };


  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/productos/ofertas');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    getProducts();
  }, []);

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reiniciar a la primera página al buscar
  }, [searchTerm, products]);

  // Calcular los productos visibles en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Manejar el cambio de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
        <Typography variant="h4" gutterBottom>
          Ofertas Especiales
        </Typography>

        {/* Barra de búsqueda */}
        <TextField
          label="Buscar productos"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: '2rem' }}
        />

        <Paper elevation={3} sx={{ padding: '1rem', mb: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              padding: '1rem',
            }}
          >
            <Grid container spacing={2}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <img
                          src={product.img || 'default-image-url'}
                          alt={product.name || 'Producto'}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                          }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {product.Nombre || 'Producto sin nombre'}
                        </Typography>
                        <Typography variant="body2">
                          Precio: <strong>${product.Precio}</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'green', fontWeight: 'bold' }}
                        >
                          {product.OFF ? `${product.OFF} de descuento` : ''}
                        </Typography>
                        <Typography variant="body2">
                          Supermercado: <strong>{supermercados[product.idSupermercado]}</strong>
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ marginTop: '1rem' }}
                          onClick={() =>
                            product.URL
                              ? window.open(product.URL, '_blank')
                              : alert('Producto no disponible')
                          }
                          disabled={!product.URL}
                        >
                          Ver Producto
                        </Button>
                        <Button
                          variant="contained"
                          color={clickedProductId === product.id ? "success" : "secondary"}
                          onClick={() => {
                            setClickedProductId(product.id); // Cambia temporalmente el color
                            agregarAlCarrito({
                              id: product.id,
                              nombre: product.Nombre,
                              precio: product.Precio,
                              img: product.img,
                              idSupermercado: product.idSupermercado,
                              idSubcategoria: product.idSubcategoria,
                              url: product.URL
                            });
                            setTimeout(() => setClickedProductId(null), 300); // Vuelve al color original después de 300ms
                          }}
                        >
                          Agregar al carrito
                        </Button>

                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
                  No se encontraron productos.
                </Typography>
              )}
            </Grid>
          </Box>
        </Paper>

        {/* Paginación */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
        />

        <Footer />
      </div>
    </Box >
  );
};

export default Ofertas;

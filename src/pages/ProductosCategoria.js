import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import HeaderBubble from '../components/HeaderBubble';
import CarritoContext from '../context/CarritoContext'; // Importa el contexto
import { Box, Typography, Grid, Card, CardContent, Button, Pagination, TextField } from '@mui/material';

const ProductosCategoria = () => {
  const { subcategoriaId } = useParams();
  const [productos, setProductos] = useState([]);
  const [subcategoriaNombre, setSubcategoriaNombre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda
  const itemsPerPage = 8;
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [clickedProductId, setClickedProductId] = useState(null);


  const supermercados = {
    21: "Tienda Inglesa",
    22: "Tata",
  };


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const responseProductos = await axios.get(`http://localhost:5001/productos/subcategoria/${subcategoriaId}`);
        setProductos(responseProductos.data);

        const responseSubcategoria = await axios.get(`http://localhost:5001/subcategoria/${subcategoriaId}`);
        setSubcategoriaNombre(responseSubcategoria.data.Nombre.trim());
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchProductos();
  }, [subcategoriaId]);

  // Filtrar productos según el término de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  const handlePageChange = (event, value) => setCurrentPage(value);

  return (
    <Box sx={{ padding: '2rem', bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      <HeaderBubble />

      <div style={{ marginTop: '5rem', marginBottom: '5rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {subcategoriaNombre ? `Productos de ${subcategoriaNombre}` : 'Cargando...'}
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


        {productosFiltrados.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No se encontraron productos.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentProducts.map((producto) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
                  <Card>
                    <CardContent>
                      <img
                        src={producto.img}
                        alt={producto.nombre}
                        style={{ width: '100%', height: 'auto', marginBottom: '0.5rem', borderRadius: '8px' }}
                      />
                      <Typography variant="h6">{producto.Nombre}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Precio: ${producto.Precio}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Supermercado: {supermercados[producto.idSupermercado]}
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ marginTop: '0.5rem' }} onClick={() => window.open(producto.URL, '_blank')}>
                        Ver Producto
                      </Button>
                      <Button
                        variant="contained"
                        color={clickedProductId === producto.id ? "success" : "secondary"}
                        onClick={() => {
                          setClickedProductId(producto.id); // Cambia temporalmente el color
                          agregarAlCarrito({
                            id: producto.id,
                            nombre: producto.Nombre,
                            precio: producto.Precio,
                            img: producto.img,
                            idSubcategoria: producto.idSubcategoria,
                            idSupermercado: producto.idSupermercado,
                            url: producto.URL
                          });
                          setTimeout(() => setClickedProductId(null), 300); // Vuelve al color original después de 300ms
                        }}
                      >
                        Agregar al carrito
                      </Button>


                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}
        <Footer />
      </div>
    </Box>
  );
};

export default ProductosCategoria;

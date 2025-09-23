import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
    sx={{
        
      bottom: 0,         // Lo alinea en la parte inferior
      left: 0,
     
      bgcolor: '#3f51b5',
      color: '#fff',
      textAlign: 'center',
      padding: '1rem 0',
      marginTop: '2rem', // Espacio entre el footer y la paginación
      width: '100%', // Abarca el ancho del contenedor sin desbordarse
      position: 'stickyrelative', // Posición relativa para un comportamiento natural
      marginBlockEnd:'-108px'
    }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} PriceCheck. Todos los derechos reservados.
      </Typography>
      <Typography variant="body2">
        Creado por{' '}
        <Link href="https://github.com/ItsEmanuel13" target="_blank" color="inherit" underline="hover">
          Emanuel Dufour - Mateo Quintela - Isaac Núñez
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;

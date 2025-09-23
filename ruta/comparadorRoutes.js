// comparadorRoutes.js
const express = require('express');
const router = express.Router();
const { compararProductos } = require('../backend/ComparadorLogica'); // Suponiendo que tienes un controlador

// Ruta POST para comparar productos
router.post('/comparar', compararProductos);

module.exports = router;

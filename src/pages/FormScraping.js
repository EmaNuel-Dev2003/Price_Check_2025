import React, { useState, useEffect } from 'react';
import HeaderBubble from '../components/HeaderBubble';
import Footer from '../components/Footer';
import { Typography, Box, FormControl, Select, Slider, MenuItem, Button, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ExtraerProductos = () => {
  const [supermercado, setSupermercado] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [errors, setErrors] = useState({ supermercado: false, subcategoria: false, cantidad: false });
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const MAX_CANTIDAD = 100; // Límite máximo del slider

  const navigate = useNavigate();


  // Definir las subcategorías por supermercado
  const subcategoriasPorSupermercado = {
    tienda_inglesa: [
      { value: 'opcion1', label: 'Aceites y Vinagres' },
      { value: 'opcion2', label: 'Aderezos y Salsas' },
      { value: 'opcion3', label: 'Alimentos en Polvo' },
      { value: 'opcion4', label: 'Arroz y Legumbres' },
      { value: 'opcion5', label: 'Azúcar y Edulcorantes' },
      { value: 'opcion6', label: 'Café, Cebada y Cocoa' },
      { value: 'opcion7', label: 'Caldos y Sopas' },
      { value: 'opcion8', label: 'Conservas' },
      { value: 'opcion9', label: 'Copetín' },
      { value: 'opcion10', label: 'Galletas' },
      { value: 'opcion11', label: 'Golosinas y Chocolates' },
      { value: 'opcion12', label: 'Harinas, Levaduras y Puré' },
      { value: 'opcion13', label: 'Huevos' },
      { value: 'opcion14', label: 'Pastas, Pizzas y Tapas' },
      { value: 'opcion15', label: 'Postres y Coberturas' },
      { value: 'opcion16', label: 'Té e Infusiones' },
      { value: 'opcion17', label: 'Yerba' },
      { value: 'opcion18', label: 'Cereales, Avenas y Semillas' },
      { value: 'opcion19', label: 'Dulces, Mermeladas y Miel' },
      { value: 'opcion20', label: 'Especias, Sal y Sazonadores' },
      { value: 'opcion21', label: 'Carnes' },
      { value: 'opcion22', label: 'Pescados y Mariscos' },
      { value: 'opcion23', label: 'Fiambres' },
      { value: 'opcion24', label: 'Quesos' },
      { value: 'opcion25', label: 'Frutas Frescas' },
      { value: 'opcion26', label: 'Verduras Frescas' },
      { value: 'opcion27', label: 'Lácteos' },
      { value: 'opcion28', label: 'Panadería' },
      { value: 'opcion29', label: 'Rotisería' },
      { value: 'opcion30', label: 'Pastas Frescas' },
      { value: 'opcion31', label: 'Bebidas con Alcohol' },
      { value: 'opcion32', label: 'Bebidas sin Alcohol' },
      { value: 'opcion33', label: 'Carnes y Aves' },
      { value: 'opcion34', label: 'Comidas Congeladas' },
      { value: 'opcion35', label: 'Frutas y Verduras Congeladas' },
      { value: 'opcion36', label: 'Hamburguesas' },
      { value: 'opcion37', label: 'Panificados Congelados' },
      { value: 'opcion38', label: 'Papas Congeladas' },
      { value: 'opcion39', label: 'Pescados y Mariscos Congelados' },
      { value: 'opcion40', label: 'Pizzas Congeladas' },
      { value: 'opcion41', label: 'Postres y Helados' },
      { value: 'opcion42', label: 'Limpieza de Baños' },
      { value: 'opcion43', label: 'Limpieza de Cocina' },
      { value: 'opcion44', label: 'Limpieza del Hogar' },
      { value: 'opcion45', label: 'Limpieza de Pisos y Muebles' },
      { value: 'opcion46', label: 'Limpieza de Ropa' },

      // Añadir más opciones específicas de Tienda Inglesa
    ],
    tata: [
      { value: 'opcion1', label: 'cafe' },
      { value: 'opcion2', label: 'cereales' },
      { value: 'opcion3', label: 'cocoa' },
      { value: 'opcion4', label: 'dulce-de-leche' },
      { value: 'opcion5', label: 'mermeladas-y-dulces' },
      { value: 'opcion6', label: 'te' },
      { value: 'opcion7', label: 'yerbas' },
      { value: 'opcion8', label: 'galletitas-dulces' },
      { value: 'opcion9', label: 'galletitas-saladas' },
      { value: 'opcion10', label: 'reposteria' },
      { value: 'opcion11', label: 'azucar-y-edulcorantes' },
      { value: 'opcion12', label: 'leche-en-polvo' },
      { value: 'opcion13', label: 'aceites' },
      { value: 'opcion14', label: 'vinagres' },
      { value: 'opcion15', label: 'mayonesa' },
      { value: 'opcion16', label: 'mostaza' },
      { value: 'opcion17', label: 'ketchup' },
      { value: 'opcion18', label: 'salsas-especiales' },
      { value: 'opcion19', label: 'sal' },
      { value: 'opcion20', label: 'saborizadores' },
      { value: 'opcion21', label: 'otros-condimentos' },
      { value: 'opcion22', label: 'alfajores' },
      { value: 'opcion23', label: 'barritas' },
      { value: 'opcion24', label: 'bocaditos-y-bombones' },
      { value: 'opcion25', label: 'caramelos-chupetines-y-gomitas' },
      { value: 'opcion26', label: 'chicles' },
      { value: 'opcion27', label: 'pastillas' },
      { value: 'opcion28', label: 'tabletas-de-chocolate' },
      { value: 'opcion29', label: 'turrones' },
      { value: 'opcion30', label: 'popcorn' },
      { value: 'opcion31', label: 'otros-panificados' },
      { value: 'opcion32', label: 'pan-de-molde' },
      { value: 'opcion33', label: 'pan-tortuga-y-viena' },
      { value: 'opcion34', label: 'budines-y-pan-dulce' },
      { value: 'opcion35', label: 'tostadas' },
      { value: 'opcion36', label: 'pan-rallado' },
      { value: 'opcion37', label: 'frutos-secos' },
      { value: 'opcion38', label: 'papas-fritas' },
      { value: 'opcion39', label: 'mani' },
      { value: 'opcion40', label: 'palitos' },
      { value: 'opcion41', label: 'otros-snacks' },
      { value: 'opcion42', label: 'aceitunas' },
      { value: 'opcion43', label: 'encurtidos' },
      { value: 'opcion44', label: 'conservas-de-verdura-y-legumbres' },
      { value: 'opcion45', label: 'conserva-de-pescado' },
      { value: 'opcion46', label: 'conserva-de-carne' },
      { value: 'opcion47', label: 'conserva-de-frutas' },
      { value: 'opcion48', label: 'arroz' },
      { value: 'opcion49', label: 'harina-y-polenta' },
      { value: 'opcion50', label: 'legumbres' },
      { value: 'opcion51', label: 'sopas' },
      { value: 'opcion52', label: 'caldos' },
      { value: 'opcion53', label: 'pure' },
      { value: 'opcion54', label: 'pastas' },
      { value: 'opcion55', label: 'salsas' },
      { value: 'opcion56', label: 'huevos' },
      { value: 'opcion57', label: 'leches' },
      { value: 'opcion58', label: 'mantecas-y-margarinas' },
      { value: 'opcion59', label: 'crema-de-leche' },
      { value: 'opcion60', label: 'levaduras-y-grasas' },
      { value: 'opcion61', label: 'postres' },
      { value: 'opcion62', label: 'quesos-untables' },
      { value: 'opcion63', label: 'yogures' },
      { value: 'opcion64', label: 'masas-de-tarta' },
      { value: 'opcion65', label: 'masas-de-empanada' },
      { value: 'opcion66', label: 'pastas-rellenas' },
      { value: 'opcion67', label: 'pastas-simples' },
      { value: 'opcion68', label: 'atados-y-carbon' },
      { value: 'opcion69', label: 'carne-vacuna' },
      { value: 'opcion70', label: 'carne-de-cerdo' },
      { value: 'opcion71', label: 'pollo' },
      { value: 'opcion72', label: 'embutidos-y-achuras' },
      { value: 'opcion73', label: 'fiambres-y-embutidos' },
      { value: 'opcion74', label: 'frankfurters' },
      { value: 'opcion75', label: 'quesos-especiales' },
      { value: 'opcion76', label: 'quesos' },
      { value: 'opcion77', label: 'queso-rallado' },
      { value: 'opcion78', label: 'frutas' },
      { value: 'opcion79', label: 'verduras' },
      { value: 'opcion80', label: 'otros' },
      { value: 'opcion81', label: 'panaderia' },
      { value: 'opcion82', label: 'pasta' },
      { value: 'opcion83', label: 'vegetales' },
      { value: 'opcion84', label: 'helados' },
      { value: 'opcion85', label: 'postres' },
      { value: 'opcion86', label: 'hamburguesas' },
      { value: 'opcion87', label: 'milanesas' },
      { value: 'opcion88', label: 'pescados' },
      { value: 'opcion89', label: 'guarniciones' },
      { value: 'opcion90', label: 'pizza' },
      { value: 'opcion91', label: 'pollo' },
      { value: 'opcion92', label: 'otras-comidas-congeladas' },
      { value: 'opcion93', label: 'empanadas-y-tartas' },
      { value: 'opcion94', label: 'papas' },
      { value: 'opcion95', label: 'frutas' },
      { value: 'opcion96', label: 'desodorante-de-ambiente' },
      { value: 'opcion97', label: 'detergentes' },
      { value: 'opcion98', label: 'lavavajillas' },
      { value: 'opcion99', label: 'limpiadores-de-cocina' },
      { value: 'opcion100', label: 'limpiadores-de-bano' },
      { value: 'opcion101', label: 'limpiadores-cremosos' },
      { value: 'opcion102', label: 'limpiadores-especificos' },
      { value: 'opcion103', label: 'lavandina' },
      { value: 'opcion104', label: 'limpiadores-de-piso' },
      { value: 'opcion105', label: 'limpia-muebles' },
      { value: 'opcion106', label: 'ceras-y-autobrillos' },
      { value: 'opcion107', label: 'jabon-liquido' },
      { value: 'opcion108', label: 'jabon-en-polvo' },
      { value: 'opcion109', label: 'jabon-en-barra' },
      { value: 'opcion110', label: 'suavizantes' },
      { value: 'opcion111', label: 'prelavados-y-quitamanchas' },
      { value: 'opcion112', label: 'perfume-para-tela' },
      { value: 'opcion113', label: 'papel-higienico' },
      { value: 'opcion114', label: 'rollos-de-cocina' },
      { value: 'opcion115', label: 'servilletas' },
      { value: 'opcion116', label: 'panuelos' },
      { value: 'opcion117', label: 'insecticidas' },
      { value: 'opcion118', label: 'repelentes' },
      { value: 'opcion119', label: 'guantes-esponjas-y-panos' },
      { value: 'opcion120', label: 'escobas-mopas-y-cepillos' },
      { value: 'opcion121', label: 'baldes-y-palanganas' },
      { value: 'opcion122', label: 'fosforos-y-encendedores' },
      { value: 'opcion123', label: 'bolsa-residuos' },
      { value: 'opcion124', label: 'otros-accesorios' },
      { value: 'opcion125', label: 'autos' },
      { value: 'opcion126', label: 'calzado' }

    ]
  };

  // Obtener las subcategorías según el supermercado seleccionado
  const subcategorias = supermercado ? subcategoriasPorSupermercado[supermercado] || [] : [];

  const handleValidateAndSubmit = async () => {
    const newErrors = {
      supermercado: !supermercado,
      subcategoria: !subcategoria,
      cantidad: !cantidad,
    };



    setErrors(newErrors);

    if (!newErrors.supermercado && !newErrors.subcategoria && !newErrors.cantidad) {
      try {
        setIsLoading(true);
        setResultMessage('');

        // Encuentra la subcategoría completa
        const selectedSubcategoria = subcategorias.find(item => item.value === subcategoria);

        const response = await fetch('http://localhost:5001/api/run-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ supermercado, subcategoria, cantidad }),
        });

        const data = await response.json();

        if (response.ok) {
          setResultMessage('El script se ejecutó correctamente.');
          // navigate('/contenidoscraping');
          navigate('/contenidoscraping', { state: { cantidad, subcategoria: selectedSubcategoria } });
        } else {
          setResultMessage(`Error: ${data.error || 'No se pudo ejecutar el script.'}`);
        }
      } catch (error) {
        console.error('Error al ejecutar el script:', error);
        setResultMessage('Error al conectarse con el servidor.');
      } finally {
        setIsLoading(false);
      }
    }


  };

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', padding: '2rem' }}>
      <HeaderBubble />

      <div style={{ marginTop: '5rem', marginBottom: '5rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
           Extraer Productos
        </Typography>
        <Typography variant="h6" gutterBottom>
          Seleccione un supermercado:
        </Typography>
        <FormControl sx={{ minWidth: 190, marginTop: '1rem', marginBottom: 5 }} error={errors.supermercado}>
          <Select value={supermercado} onChange={(e) => setSupermercado(e.target.value)} displayEmpty>
            <MenuItem value="">Seleccione...</MenuItem>
            <MenuItem value="tienda_inglesa">Tienda Inglesa</MenuItem>
            <MenuItem value="tata">Tata</MenuItem>
          </Select>
          {errors.supermercado && <FormHelperText>Seleccione un supermercado.</FormHelperText>}
        </FormControl>

        <Typography variant="h6" gutterBottom>
          Seleccione una subcategoría:
        </Typography>
        <FormControl sx={{ minWidth: 190, marginTop: '1rem', marginBottom: 5 }} error={errors.subcategoria}>
          <Select value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} displayEmpty>
            <MenuItem value="">Seleccione...</MenuItem>
            {subcategorias.map((subcat) => (
              <MenuItem key={subcat.value} value={subcat.value}>
                {subcat.label}
              </MenuItem>
            ))}
          </Select>
          {errors.subcategoria && <FormHelperText>Seleccione una subcategoría.</FormHelperText>}
        </FormControl>

        <Typography variant="h6" gutterBottom>
          Seleccione la cantidad de productos:
        </Typography>
        <FormControl sx={{ minWidth: 190, marginLeft: '1rem', marginTop: '1rem', marginBottom: 0.5 }} error={errors.cantidad}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => setCantidad(Math.max(1, cantidad - 1))} // Evitar valores menores a 1
              disabled={cantidad <= 1}
            >
              -
            </Button>
            <Typography variant="body1" sx={{ marginLeft: '1rem', marginRight: '1rem' }}>
              {cantidad}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setCantidad(Math.min(100, cantidad + 1))} // Evitar valores mayores a 100
              disabled={cantidad >= 100}
            >
              +
            </Button>
          </div>
          {errors.cantidad && <FormHelperText>Seleccione la cantidad de productos.</FormHelperText>}
        </FormControl>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0rem' }}>
        <Button variant="contained" color="primary" onClick={handleValidateAndSubmit} disabled={isLoading}>
          {isLoading ? 'Ejecutando...' : 'Extraer'}
        </Button>
      </div>

      {resultMessage && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Typography variant="body1" color={resultMessage.includes('Error') ? 'error' : 'primary'}>
            {resultMessage}
          </Typography>
        </div>
      )}

      <Footer />
    </Box>
  );


};

export default ExtraerProductos;

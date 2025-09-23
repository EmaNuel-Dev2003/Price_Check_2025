const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const resemble = require('resemblejs');
const sharp = require('sharp');




const stringSimilarity = require('string-similarity');

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
        .replace(/[^a-z0-9\s]/g, "") // Eliminar caracteres especiales
        .replace(/\s+/g, " ") // Reducir múltiples espacios a uno
        .trim(); // Eliminar espacios al principio y al final
}

function compararMarcas(marca1,marca2){

    return stringSimilarity.compareTwoStrings(marca1, marca2);
}

// Función para descargar la imagen desde la URL
async function descargarImagenComoBuffer(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al descargar la imagen: ${response.statusText}`);
    return await response.buffer();
}

// Función para redimensionar y convertir la imagen a un formato común
async function procesarImagen(buffer, ancho = 500, alto = 500) {
    return await sharp(buffer)
        .resize(ancho, alto) // Redimensionar a un tamaño común
        .toFormat('png') // Convertir al formato PNG
        .toBuffer();
}

// Función para comparar imágenes usando resemble.js
async function compararImagenes(url1, url2) {
    try {
        // Descargar las imágenes
        const buffer1 = await descargarImagenComoBuffer(url1);
        const buffer2 = await descargarImagenComoBuffer(url2);

        // Procesar ambas imágenes: redimensionar y convertir al formato PNG
        const buffer1Procesada = await procesarImagen(buffer1);
        const buffer2Procesada = await procesarImagen(buffer2);

        // Guardar las imágenes redimensionadas como archivos temporales (resemble.js trabaja con rutas de archivos)
        const archivo1 = './image1.png';
        const archivo2 = './image2.png';

           // Guardar las imágenes procesadas
           await sharp(buffer1Procesada).toFile(archivo1);
           await sharp(buffer2Procesada).toFile(archivo2);

        return new Promise((resolve, reject) => {
            // Usar resemble.js para comparar las imágenes
            resemble(archivo1)
                .compareTo(archivo2)
                .onComplete(function (data) {
                    resolve(data.rawMisMatchPercentage);
                });
        });
    } catch (err) {
        console.error("Error al comparar imágenes:", err);
    }
}



// Función para comparar los nombres de los productos
function compararNombres(nombre1, nombre2) {
    // Usar string-similarity para comparar los nombres
    return stringSimilarity.compareTwoStrings(nombre1, nombre2);
    
}

function extraerNumero(texto) {
    let match = texto.match(/\b\d+(\.\d+)?\b/); // Extrae el primer número encontrado
    return match ? parseFloat(match[0]) : null; // Convierte a número
}

function compararNumeros(nombre1, nombre2) {
    let num1 = extraerNumero(nombre1);
    let num2 = extraerNumero(nombre2);

    return num1 !== null && num2 !== null && num1 === num2 ? 100 : 0;
}

// Función para calcular el porcentaje final de similitud entre los productos
async function compararProductos(url1, url2, nombre1, nombre2) {
    try {
        // Normalizar los nombres antes de comparar
        const nombre1Normalizado = normalizarTexto(nombre1);
        const nombre2Normalizado = normalizarTexto(nombre2);

        // Comparar los nombres de los productos
        const similitudNombres = compararNombres(nombre1Normalizado, nombre2Normalizado);
        console.log(`Similitud de nombres: ${similitudNombres * 100}%`);

        // Comparar números en los nombres (cantidad del producto)
        const similitudCantidades = compararNumeros(nombre1Normalizado, nombre2Normalizado);
        console.log(`Similitud de cantidades: ${similitudCantidades}%`);

        // Comparar las imágenes de los productos
        let similitudImagenes = await compararImagenes(url1, url2);
        similitudImagenes = similitudImagenes !== undefined ? (100 - similitudImagenes) : 100; // Ajuste en caso de error
        console.log(`Similitud de imágenes: ${similitudImagenes}%`);

        // Definir pesos
        const pesoNombres = 0.5;
        const pesoCantidades = 0.2;
        const pesoImagenes = 0.3;

        // Calcular el porcentaje final ponderado
        const porcentajeFinal = (
            (similitudNombres * 100 * pesoNombres) + 
            (similitudCantidades * pesoCantidades) + 
            (similitudImagenes * pesoImagenes)
        ) / (pesoNombres + pesoCantidades + pesoImagenes);

        console.log(`Similitud final combinada: ${porcentajeFinal}%`);

        if (porcentajeFinal >= 80) {
            console.log("Los productos son iguales");
        } else {
            console.log("Los productos no son iguales");
        }

        return porcentajeFinal;
    } catch (err) {
        console.error("Error al comparar productos:", err);
    }
}


// URLs y nombres de ejemplo


/*
const url1 = "https://prod-resize.tiendainglesa.com.uy/images/medium/P379145-2.jpg?20220520113142,Galleta-OREO-354-gr-en-Tienda-Inglesa";
const url2 = "https://tatauy.vtexassets.com/unsafe/0x0/center/middle/https%3A%2F%2Ftatauy.vtexassets.com%2Farquivos%2Fids%2F570886%2FGalletas-Rellenas-Oreo-Regular-354-G-1-3710.jpg%3Fv%3D638077845665500000"
const nombre1 =  "Galleta OREO 354 gr"
const nombre2 =  "Galletas Rellenas Oreo Regular 354 G" 
// const marca1 = "COCA-COLA"
// const marca2 = "Coca Cola"

// Ejecutar la comparación de productos
compararProductos(url1, url2, nombre1, nombre2);  */


module.exports = { compararProductos };

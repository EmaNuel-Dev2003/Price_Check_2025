const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
//const bcrypt = require('bcrypt');
const path = require('path');
const scriptPath = path.resolve(__dirname, 'script_node.js');
const { spawn } = require('child_process');
const { compararProductos } = require('./ComparadorLogica.js');


require('dotenv').config();


const app = express();
const port = process.env.PORT || 5001;


// Configura CORS
app.use(cors());
app.use(express.json());



// Conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Configuración para la segunda base de datos
const poolProductos = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bd_prueba_productos',
    password: 'Programador321',
    port: 5432,
});

// Ruta para obtener datos de productos
app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


// Ruta para obtener productos de la base de datos de prueba
app.get('/productos/prueba', async (req, res) => {
    try {
        const result = await poolProductos.query('SELECT * FROM productos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos de la base de datos de prueba' });
    }
});

app.get('/productos/comparar', async (req, res) => {
    const { nombre } = req.query;
    try {
        const query = `
           SELECT 
                p."Nombre" AS producto,
                p."Precio",
                s.Nombre AS supermercado,
                s.id AS idSupermercado,  
                p.id AS id,  
                p."img",
                p."URL",
                p."idSubcategoria",
                similarity(p."Nombre", $1) AS similitud
            FROM 
                "productos" p
            JOIN 
                "supermercados" s 
            ON 
                p."idSupermercado" = s."id"
            WHERE 
                p."Nombre" % $1
            ORDER BY 
                similitud DESC
            LIMIT 8;
        `;
        const result = await pool.query(query, [nombre]);
       // console.log("Resultados enviados al frontend:", result.rows);
        console.log(result.rows); // Asegúrate de que los datos estén correctos
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al realizar la comparación' });
    }
});


// Nueva ruta para obtener solo productos con ofertas
app.get('/productos/ofertas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos WHERE "OFF" IS NOT NULL AND "OFF" != \'\'');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos con ofertas' });
    }


});

app.get('/categorias', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id AS categoria_id, 
                c."Nombre" AS categoria_nombre, 
                s.id AS subcategoria_id, 
                s."Nombre" AS subcategoria_nombre 
            FROM 
                "Categorias" c
            LEFT JOIN 
                "Subcategorias" s 
            ON 
                c.id = s."idCategoria"
            ORDER BY 
                c.id, s.id;
        `;

        const result = await pool.query(query);

        // Transformar el resultado para agrupar subcategorías por categoría
        const categorias = {};
        result.rows.forEach(row => {
            if (!categorias[row.categoria_id]) {
                categorias[row.categoria_id] = {
                    id: row.categoria_id,
                    nombre: row.categoria_nombre.trim(),
                    subcategorias: []
                };
            }
            if (row.subcategoria_id) {
                categorias[row.categoria_id].subcategorias.push({
                    id: row.subcategoria_id,
                    nombre: row.subcategoria_nombre.trim()
                });
            }
        });

        res.json(Object.values(categorias));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener categorías y subcategorías' });
    }
});

// subcategorías Y categoría
app.get('/productos/subcategoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM productos WHERE "idSubcategoria" = $1',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos por subcategoría' });
    }
});

app.get('/subcategoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT "Nombre" FROM "Subcategorias" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subcategoría no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener la subcategoría' });
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM "Usuarios" WHERE "Email" = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.json({ success: false, message: 'El correo ya está registrado' });
        }
        await pool.query(
            'INSERT INTO "Usuarios" ("Nombre", "Email", "Contraseña", "FechaRegistro") VALUES ($1, $2, $3, NOW())',
            [name, email, password]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT "Nombre" FROM "Usuarios" WHERE "Email" = $1 AND "Contraseña" = $2',
            [email, password]
        );
        if (result.rows.length > 0) {
            res.json({ success: true, name: result.rows[0].Nombre });
        } else {
            res.json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

app.post('/api/run-script', (req, res) => {
    const { cantidad, subcategoria, supermercado } = req.body;
    const scriptPath = path.resolve(__dirname, 'script_node.js');
    const process = spawn("node", [scriptPath, cantidad, subcategoria, supermercado]);

    console.log('Datos recibidos del frontend:', { cantidad, subcategoria, supermercado });

    let responseSent = false; // Bandera para rastrear si ya se envió una respuesta

    process.stdout.on('data', (data) => {
        console.log(`Salida del script: ${data.toString()}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`Error del script: ${data.toString()}`);
        if (!responseSent) {
            responseSent = true; // Marca la respuesta como enviada
            res.status(500).json({ error: 'Error al ejecutar el script' });
        }
    });

    process.on('close', (code) => {
        console.log(`El script_node.js terminó con el código ${code}`);
        if (!responseSent) {
            if (code === 0) {
                responseSent = true; // Marca la respuesta como enviada
                res.json({ message: 'Script ejecutado correctamente' });
            } else {
                responseSent = true; // Marca la respuesta como enviada
                res.status(500).json({ error: `El script finalizó con código ${code}` });
            }
        }
    });

    process.on('error', (err) => {
        console.error(`Error al ejecutar el proceso: ${err.message}`);
        if (!responseSent) {
            responseSent = true; // Marca la respuesta como enviada
            res.status(500).json({ error: 'Error al ejecutar el proceso.' });
        }
    });
});

app.get('/productos/script', (req, res) => {
    const scriptPath = path.resolve(__dirname, 'script_node.js');
    const process = spawn("node", [scriptPath]);

    let productosScript = '';

    process.stdout.on('data', (data) => {
        productosScript += data.toString(); // Captura la salida del script
    });

    process.stderr.on('data', (data) => {
        console.error(`Error del script: ${data.toString()}`);
        res.status(500).json({ error: 'Error al ejecutar el script.' });
    });

    process.on('close', (code) => {
        if (code === 0) {
            try {
                const productos = JSON.parse(productosScript); // Asegúrate de que el script retorna datos en formato JSON
                res.json(productos);
            } catch (err) {
                console.error('Error al parsear los productos:', err);
                res.status(500).json({ error: 'Error al parsear los productos.' });
            }
        } else {
            res.status(500).json({ error: `El script terminó con código ${code}.` });
        }
    });
});

// Ruta para eliminar un producto por ID
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Realizamos la eliminación del producto en la base de datos
        const result = await poolProductos.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Si el producto se eliminó correctamente
        res.json({ message: `Producto con ID ${id} eliminado correctamente` });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

//elimina todos los productos
app.delete('/eliminarproductos', async (req, res) => {
    try {
        const result = await poolProductos.query('DELETE FROM productos RETURNING *');

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No hay productos para eliminar' });
        }

        res.json({ message: `Se eliminaron ${result.rowCount} productos` });
    } catch (err) {
        console.error('Error al eliminar productos:', err);
        res.status(500).json({ error: 'Error al eliminar los productos' });
    }
});



app.get('/productos/cantidad', async (req, res) => {
    try {
        const result = await poolProductos.query('SELECT COUNT(*) FROM productos');
        const cantidad = result.rows[0].count;
        res.json({ cantidad });
    } catch (err) {
        console.error('Error al obtener cantidad de productos:', err);
        res.status(500).json({ error: 'Error al obtener la cantidad de productos' });
    }
});


app.post('/guardar-carrito', async (req, res) => {
    const { productos } = req.body; // 🔹 Recibimos el total del carrito
    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'No se recibieron productos' });
    } else {
        console.log("Productos recibidos...");
    }

    /*
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'db_proyecto_final02',
        password: 'Programador321',
        port: 5432,
    }); */

    let resultados = [];
    let costoTotalSimilares = 0;
    var costoTotalCarrito = 0;

    var nombreSupermercadoSimilar;
    var nombreSupermercadoCarrito;
    var urlCarrito;

    try {
        for (let productoCarrito of productos) {
            const { idSubcategoria, idSupermercado, nombre, img, precio, cantidad, url } = productoCarrito;
            urlCarrito = url;

            // Acumulando el costo total de los productos en el carrito
            costoTotalCarrito += precio * cantidad;

            // 1️ Cambiar el idSupermercado al supermercado opuesto
            const idSupermercadoOpuesto = idSupermercado === 21 ? 22 : 21;

            // 2️ Buscar productos en el supermercado opuesto
            const query = `
            SELECT id, "Nombre", img, "Precio", "URL", similarity("Nombre", $3) AS similitud
            FROM productos 
            WHERE "idSubcategoria" = $1 AND "idSupermercado" = $2
            ORDER BY similitud DESC
            LIMIT 10;
        `;
            const { rows: productosSimilares } = await pool.query(query, [idSubcategoria, idSupermercadoOpuesto, nombre]);
            let mejorCoincidencia = null;



            // 3️ Comparar cada producto encontrado con el del carrito
            for (let productoBD of productosSimilares) {

                // Si la similitud del nombre es menor a 0.5, descartamos el producto
                if (productoBD.similitud < 0.5) continue;

                const similitud = await compararProductos(img, productoBD.img, nombre, productoBD.Nombre);

                if (idSupermercadoOpuesto === 21) {
                    nombreSupermercadoSimilar = "Tienda Inglesa"
                    nombreSupermercadoCarrito = "Tata"

                } else {
                    nombreSupermercadoSimilar = "Tata"
                    nombreSupermercadoCarrito = "Tienda Inglesa"
                }

                if (similitud >= 70) {
                    // Si aún no hay una mejor coincidencia o esta es mejor, la guardamos
                    if (!mejorCoincidencia || similitud > mejorCoincidencia.similitud) {
                        // Acumulando el costo total de los productos similares
                        costoTotalSimilares += productoBD.Precio * cantidad;

                        mejorCoincidencia = {
                            idProducto: productoBD.id,
                            nombre: productoBD.Nombre,
                            imagen: productoBD.img,
                            similitud: similitud.toFixed(2) + '%',
                            idSupermercado: idSupermercadoOpuesto,
                            idSubcategoria: idSubcategoria,
                            precio: productoBD.Precio,
                            cantidad: productoBD.cantidad,
                            nombreTienda: nombreSupermercadoSimilar,
                            urlSimilar: productoBD.URL
                        };
                    }
                }
            }

            // 4️ Guardar el resultado en la lista de resultados
            resultados.push({
                productoCarrito: {
                    nombre,
                    img,
                    precio,
                    idSupermercado,
                    idSubcategoria,
                    cantidad,
                    nombreSupermercadoCarrito,
                    urlCarrito
                },
                mejorCoincidencia: mejorCoincidencia || null
            });
        }

        console.log(resultados);
        console.log("Costo total del carrito recibido:", costoTotalCarrito);
        console.log("Costo total de productos similares:", costoTotalSimilares);
        console.log("URL carrito: ", urlCarrito);


        // 5️ Enviar los resultados al frontend
        res.json({ resultados, costoTotalCarrito, costoTotalSimilares });

    } catch (error) {
        console.error("Error en la comparación:", error);
        res.status(500).json({ error: "Ocurrió un error al procesar la comparación." });
    }
});

// 🔹 Cerrar la conexión cuando el servidor se apaga
process.on('SIGINT', async () => {
    console.log("Cerrando conexión con PostgreSQL...");
    await pool.end();
    process.exit(0);
});



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


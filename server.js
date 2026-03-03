/**
 * SERVIDOR DE PRODUCCIÓN - YEGO LOGÍSTICA
 * Configurado para Node.js v20 en Render.com
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE RUTAS ESTÁTICAS
// Intentamos servir desde la raíz del proyecto
const ROOT_DIR = path.resolve(__dirname);
app.use(express.static(ROOT_DIR));

// Base de datos en memoria para POZ987 y otros
let baseDatos = [];

/**
 * RUTA PRINCIPAL (ELIMINA EL ERROR ENOENT)
 */
app.get('/', (req, res) => {
    // Intentamos varias rutas posibles para asegurar que el archivo se encuentre
    const posiblesRutas = [
        path.join(ROOT_DIR, 'index.html'),
        path.join(ROOT_DIR, 'public', 'index.html'),
        path.join('/opt/render/project/src', 'index.html')
    ];

    let archivoEncontrado = null;
    for (const ruta of posiblesRutas) {
        if (fs.existsSync(ruta)) {
            archivoEncontrado = ruta;
            break;
        }
    }

    if (archivoEncontrado) {
        res.sendFile(archivoEncontrado);
    } else {
        res.status(404).send(`
            <h1>Error de Configuración en Render</h1>
            <p>El servidor no encuentra el archivo <b>index.html</b>.</p>
            <p>Ruta actual: ${ROOT_DIR}</p>
            <p>Archivos detectados: ${fs.readdirSync(ROOT_DIR).join(', ')}</p>
        `);
    }
});

// API: Guardar
app.post('/guardar', (req, res) => {
    const data = req.body;
    const index = baseDatos.findIndex(i => i.v.placa === data.v.placa);
    if (index !== -1) {
        baseDatos[index] = data;
    } else {
        baseDatos.push(data);
    }
    res.json({ mensaje: "Sincronización Exitosa con Render", placa: data.v.placa });
});

// API: Listar
app.get('/listar', (req, res) => {
    res.json(baseDatos);
});

// API: Consultar por placa
app.get('/consultar/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    const registro = baseDatos.find(i => i.v.placa === placa);
    if (registro) {
        res.json(registro);
    } else {
        res.status(404).json({ error: "No encontrado" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`Servidor YEGO activo en puerto ${PORT}`);
    console.log(`Directorio raíz: ${ROOT_DIR}`);
    console.log(`=========================================`);
});

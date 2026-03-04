const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuramos la ruta hacia la carpeta 'public'
const publicPath = path.join(__dirname, 'public');

// Servir archivos estáticos desde 'public'
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <h2>Error de Configuración</h2>
            <p>El servidor no encuentra index.html en: <b>${indexPath}</b></p>
            <p>Contenido de la carpeta public: ${fs.readdirSync(publicPath).join(', ')}</p>
        `);
    }
});

// APIs para la gestión de la flota
let baseDatos = [];

app.post('/guardar', (req, res) => {
    const nuevo = req.body;
    const index = baseDatos.findIndex(v => v.v.placa === nuevo.v.placa);
    if(index !== -1) baseDatos[index] = nuevo;
    else baseDatos.push(nuevo);
    res.json({ mensaje: "Sincronizado con Render", placa: nuevo.v.placa });
});

app.get('/listar', (req, res) => res.json(baseDatos));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
    console.log(`Buscando en: ${publicPath}`);
});

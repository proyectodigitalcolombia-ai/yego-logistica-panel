const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sirve archivos estáticos desde la raíz
app.use(express.static(__dirname));

// Base de datos temporal
let baseDatos = [];

// Ruta para verificar existencia del archivo (Diagnóstico)
app.get('/check-file', (req, res) => {
    const fs = require('fs');
    const filePath = path.join(__dirname, 'index.html');
    res.json({ 
        exists: fs.existsSync(filePath),
        path: filePath,
        dirContents: fs.readdirSync(__dirname)
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas de API
app.post('/guardar', (req, res) => {
    const data = req.body;
    const index = baseDatos.findIndex(i => i.v.placa === data.v.placa);
    index !== -1 ? baseDatos[index] = data : baseDatos.push(data);
    res.json({ mensaje: "Datos de POZ987 sincronizados" });
});

app.get('/listar', (req, res) => res.json(baseDatos));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

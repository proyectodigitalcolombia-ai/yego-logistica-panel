const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE RUTAS PARA RENDER
// El archivo index.html está dentro de 'public'
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Base de datos volátil (en memoria de Render)
let baseDatosFlota = [];

// RUTA PRINCIPAL
app.get('/', (req, res) => {
    const file = path.join(publicPath, 'index.html');
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.status(404).send("Error: No se encuentra public/index.html en el repositorio.");
    }
});

// ENDPOINT: Guardar o Actualizar Vehículo
app.post('/guardar', (req, res) => {
    const vehiculo = req.body;
    // Evitar duplicados por placa
    const index = baseDatosFlota.findIndex(v => v.v.placa === vehiculo.v.placa);
    
    if (index !== -1) {
        baseDatosFlota[index] = vehiculo;
    } else {
        baseDatosFlota.push(vehiculo);
    }
    
    console.log(`Unidad sincronizada: ${vehiculo.v.placa}`);
    res.json({ mensaje: "Sincronización Exitosa con Render", total: baseDatosFlota.length });
});

// ENDPOINT: Listar todos los registros (Base de Datos)
app.get('/listar', (req, res) => {
    res.json(baseDatosFlota);
});

// ENDPOINT: Consultar una placa específica
app.get('/consultar/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    const resultado = baseDatosFlota.find(v => v.v.placa === placa);
    if (resultado) {
        res.json(resultado);
    } else {
        res.status(404).json({ error: "No encontrado" });
    }
});

// INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`========== YEGO LOGISTICA SERVER ==========`);
    console.log(`Puerto: ${PORT}`);
    console.log(`Ruta Public: ${publicPath}`);
    console.log(`NODE_VERSION configurada: 20`);
    console.log(`===========================================`);
});

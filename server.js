const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// BASE DE DATOS EN MEMORIA
let baseDatos = [];

// Ruta para ver la lista completa
app.get('/listar', (req, res) => {
    console.log("Enviando lista de vehículos. Total:", baseDatos.length);
    res.json(baseDatos);
});

// Ruta para guardar
app.post('/guardar', (req, res) => {
    const data = req.body;
    const index = baseDatos.findIndex(v => v.v.placa === data.v.placa);
    
    if (index !== -1) {
        baseDatos[index] = data; // Actualiza si ya existe
    } else {
        baseDatos.push(data); // Agrega nuevo
    }
    console.log("Placa guardada con éxito:", data.v.placa);
    res.json({ mensaje: "Guardado en Render", total: baseDatos.length });
});

// Ruta para consultar una sola placa
app.get('/consultar/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    const unidad = baseDatos.find(u => u.v.placa === placa);
    if (unidad) res.json(unidad);
    else res.status(404).send("No encontrado");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

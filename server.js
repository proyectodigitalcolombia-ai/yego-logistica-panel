const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const DB_PATH = path.join(__dirname, 'data', 'vehiculos.json');
const CONFIG_PATH = path.join(__dirname, 'data', 'config.json');

// Crear carpetas y archivos si no existen
if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
if (!fs.existsSync(CONFIG_PATH)) fs.writeFileSync(CONFIG_PATH, JSON.stringify({ claveAdmin: 'admin1234' }, null, 2));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const leerDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const leerConfig = () => JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// RUTAS PRINCIPALES
app.get('/listar', (req, res) => res.json(leerDB()));

app.post('/guardar', (req, res) => {
    let db = leerDB();
    const nuevo = req.body;
    const index = db.findIndex(i => i.v.placa.toUpperCase() === nuevo.v.placa.toUpperCase());
    if (index !== -1) db[index] = nuevo; else db.push(nuevo);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ mensaje: "✅ Guardado exitosamente" });
});

app.delete('/eliminar/:placa', (req, res) => {
    const { clave } = req.body;
    if (clave !== leerConfig().claveAdmin) return res.status(401).json({ error: "Clave incorrecta" });
    let db = leerDB().filter(i => i.v.placa.toUpperCase() !== req.params.placa.toUpperCase());
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ mensaje: "✅ Registro eliminado" });
});

app.post('/cambiar-clave', (req, res) => {
    const { claveActual, claveNueva } = req.body;
    let config = leerConfig();
    if (claveActual !== config.claveAdmin) return res.status(401).json({ error: "Clave actual incorrecta" });
    config.claveAdmin = claveNueva;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    res.json({ mensaje: "🔐 Clave actualizada" });
});

app.get('/consultar/:t', (req, res) => {
    const r = leerDB().find(i => i.v.placa.toUpperCase() === req.params.t.toUpperCase() || i.c.cc === req.params.t);
    if (r) res.json(r); else res.status(404).json({ error: "No encontrado" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 YEGO ONLINE: http://localhost:${PORT}`));

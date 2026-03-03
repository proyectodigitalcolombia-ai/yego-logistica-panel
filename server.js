const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Forzamos que el servidor use la carpeta actual
const dirActual = process.cwd();

app.get('/', (req, res) => {
    // Lista de posibles ubicaciones del index.html para evitar el ENOENT
    const rutas = [
        path.join(dirActual, 'index.html'),
        path.join(__dirname, 'index.html'),
        '/opt/render/project/src/index.html'
    ];

    let encontrado = false;
    for (const ruta of rutas) {
        if (fs.existsSync(ruta)) {
            res.sendFile(ruta);
            encontrado = true;
            break;
        }
    }

    if (!encontrado) {
        res.status(404).send("Error crítico: El archivo index.html no existe en la raíz del repositorio de GitHub.");
    }
});

// Rutas API para los datos de POZ987
let baseDatos = [];
app.post('/guardar', (req, res) => {
    baseDatos.push(req.body);
    res.json({ mensaje: "Guardado" });
});

app.get('/listar', (req, res) => res.json(baseDatos));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
    console.log(`Buscando archivos en: ${dirActual}`);
});

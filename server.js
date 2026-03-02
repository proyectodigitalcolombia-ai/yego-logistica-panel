const express = require('express');
const multer = require('multer'); // Para subir archivos
const xlsx = require('xlsx');     // Para leer Excel
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Para servir tu HTML

const upload = multer({ dest: 'uploads/' });

// --- RUTA PARA SUBIR EL EXCEL ---
app.post('/importar-excel', upload.single('archivo'), (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Mapeo basado en TU archivo (Celdas específicas)
        const vehiculo = {
            placa: data[2][3], // Ajustado según tu Excel
            usuario_gps: data[5][4],
            clave_gps: data[5][6],
            conductor: data[8][2]
        };

        console.log("🚛 Datos extraídos del Excel:", vehiculo);
        res.json({ mensaje: "Excel procesado con éxito", datos: vehiculo });
    } catch (e) {
        res.status(500).json({ error: "Error leyendo el archivo" });
    }
});

// --- RUTA PARA EL BOTÓN "GO" ---
app.post('/disparar-robot', async (req, res) => {
    // Aquí el panel llama a tu OTRO servicio de Render (el robot)
    // usando la placa y claves guardadas.
});

app.listen(3000, () => console.log("🚀 Panel corriendo en puerto 3000"));

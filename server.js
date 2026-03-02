const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Aquí guardaremos el index.html

// RUTA PARA PROCESAR EL EXCEL
app.post('/importar', upload.single('archivo'), (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Mapeo exacto basado en tu formato de Excel
        const info = {
            vehiculo: {
                placa: data[2][3],      // Celda D3 aprox
                usuario_gps: data[5][4], // Celda E6
                clave_gps: data[5][6]    // Celda G6
            },
            conductor: {
                nombre: data[8][2],     // Celda C9
                celular: data[11][2]    // Celda C12
            }
        };

        console.log("✅ Datos extraídos:", info);
        res.json(info);
    } catch (error) {
        res.status(500).json({ error: "Error al leer el archivo" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Panel en puerto ${PORT}`));

const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// 1. Forzar la ruta absoluta a la carpeta public
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// 2. Ruta raíz corregida
app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Error: No se encontró la carpeta 'public' o el archivo 'index.html' en GitHub. Revisa los nombres de las carpetas.");
    }
});

// 3. Ruta para importar Excel
app.post('/importar', upload.single('archivo'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file" });
        const workbook = xlsx.readFile(req.file.path);
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
        
        const info = {
            vehiculo: {
                placa: data[2] ? data[2][3] : '',
                marca: data[2] ? data[2][5] : '',
                usuario_gps: data[5] ? data[5][4] : '',
                clave_gps: data[5] ? data[5][6] : ''
            },
            conductor: {
                nombre: data[8] ? data[8][2] : ''
            }
        };
        fs.unlinkSync(req.file.path);
        res.json(info);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));

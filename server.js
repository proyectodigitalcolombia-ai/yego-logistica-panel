const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/importar', upload.single('archivo'), (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Mapeo exacto basado en la estructura de la imagen
        // Los índices en JS empiezan en 0 (Columna A=0, B=1, C=2, D=3...)
        const info = {
            v: {
                placa: data[2] ? data[2][1] : '',     // B3
                marca: data[2] ? data[2][4] : '',     // E3
                color: data[2] ? data[2][7] : '',     // H3
                clase: data[3] ? data[3][1] : '',     // B4
                modelo: data[3] ? data[3][4] : '',    // E4
                repo: data[3] ? data[3][7] : '',      // H4
                linea: data[4] ? data[4][1] : '',     // B5
                motor: data[4] ? data[4][4] : '',     // E5
                chasis: data[4] ? data[4][7] : '',    // H5
                gps_co: data[5] ? data[5][1] : '',    // B6
                user: data[5] ? data[5][4] : '',      // E6
                pass: data[5] ? data[5][7] : '',      // H6
                trayler: data[6] ? data[6][1] : '',   // B7
                carro: data[6] ? data[6][4] : '',     // E7
                m_trayler: data[6] ? data[6][7] : ''  // H7
            },
            c: {
                nom: data[9] ? data[9][1] : '',       // B10
                cc: data[9] ? data[9][4] : '',        // E10
                lic: data[9] ? data[9][7] : ''        // H10
            }
        };

        fs.unlinkSync(req.file.path);
        res.json(info);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

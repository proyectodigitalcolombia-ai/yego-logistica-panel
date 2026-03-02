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

        // MAPEAMOS TODO SEGÚN TU IMAGEN DE EXCEL
        const info = {
            v: {
                placa: data[2]?.[1] || '', marca: data[2]?.[4] || '', color: data[2]?.[7] || '',
                clase: data[3]?.[1] || '', modelo: data[3]?.[4] || '', repo: data[3]?.[7] || '',
                linea: data[4]?.[1] || '', motor: data[4]?.[4] || '', chasis: data[4]?.[7] || '',
                gps_co: data[5]?.[1] || '', user: data[5]?.[4] || '', pass: data[5]?.[7] || '',
                trayler: data[6]?.[1] || '', carro: data[6]?.[4] || '', m_trayler: data[6]?.[7] || ''
            },
            c: {
                nom: data[9]?.[1] || '', cc: data[9]?.[4] || '', lic: data[9]?.[7] || '',
                cat: data[10]?.[1] || '', venc: data[10]?.[4] || '', dir: data[10]?.[7] || '',
                tel: data[11]?.[1] || '', ciu: data[11]?.[4] || '', cel: data[12]?.[1] || '',
                arl: data[12]?.[4] || '', eps: data[12]?.[7] || '', mail: data[13]?.[1] || ''
            },
            t: {
                nom: data[16]?.[1] || '', nit: data[16]?.[4] || '', dir: data[16]?.[7] || '',
                tel: data[17]?.[1] || '', cel: data[17]?.[4] || '', ciu: data[17]?.[7] || '',
                mail: data[18]?.[1] || ''
            },
            p: {
                nom: data[19]?.[1] || '', nit: data[19]?.[4] || '', dir: data[19]?.[7] || '',
                tel: data[20]?.[1] || '', cel: data[20]?.[4] || '', ciu: data[20]?.[7] || '',
                mail: data[21]?.[1] || ''
            },
            r: {
                e1: data[24]?.[1] || '', e2: data[24]?.[4] || '', per: data[24]?.[7] || '',
                t1: data[25]?.[1] || '', t2: data[25]?.[4] || '', tp: data[25]?.[7] || ''
            }
        };

        fs.unlinkSync(req.file.path);
        res.json(info);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor YEGO activo` || ''));

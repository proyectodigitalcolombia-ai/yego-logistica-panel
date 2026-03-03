const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });
const DB_PATH = '/data/vehiculos.json';

if (!fs.existsSync(DB_PATH)) {
    try { fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2)); } catch (e) {}
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const leerDB = () => {
    try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); } catch (e) { return []; }
};

app.post('/importar', upload.single('archivo'), (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
        
        const info = {
            v: { 
                placa: data[2]?.[1] || '', marca: data[2]?.[4] || '', color: data[2]?.[7] || '', 
                clase: data[3]?.[1] || '', modelo: data[3]?.[4] || '', repo: data[3]?.[7] || '',
                linea: data[4]?.[1] || '', motor: data[4]?.[4] || '', chasis: data[4]?.[7] || '',
                gps_co: data[5]?.[1] || '', user: data[5]?.[4] || '', pass: data[5]?.[7] || '',
                trayler: data[6]?.[1] || '', carro: data[6]?.[4] || '', m_trailer: data[6]?.[7] || '',
                soat: data[7]?.[1] || '', tecno: data[7]?.[4] || ''
            },
            c: { 
                nom: data[9]?.[1] || '', cc: data[9]?.[4] || '', lic: data[9]?.[7] || '',
                cat: data[10]?.[1] || '', venc_lic: data[10]?.[4] || '', dir: data[10]?.[7] || '',
                tel: data[11]?.[1] || '', ciu: data[11]?.[4] || '', cel: data[12]?.[1] || '',
                arl: data[12]?.[4] || '', eps: data[12]?.[7] || '', mail: data[13]?.[1] || ''
            },
            t: { nom: data[16]?.[1] || '', nit: data[16]?.[4] || '', dir: data[16]?.[7] || '', tel: data[17]?.[1] || '', mail: data[18]?.[1] || '' },
            p: { nom: data[19]?.[1] || '', nit: data[19]?.[4] || '', dir: data[19]?.[7] || '', tel: data[20]?.[1] || '', mail: data[21]?.[1] || '' },
            r: { 
                e1: data[24]?.[1] || '', t1: data[25]?.[1] || '', 
                e2: data[24]?.[4] || '', t2: data[25]?.[4] || '', 
                per: data[24]?.[7] || '', tp: data[25]?.[7] || '' 
            }
        };
        fs.unlinkSync(req.file.path);
        res.json(info);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/guardar', (req, res) => {
    let db = leerDB();
    const nuevo = req.body;
    const index = db.findIndex(i => i.v.placa.toUpperCase() === nuevo.v.placa.toUpperCase());
    if (index !== -1) db[index] = nuevo; else db.push(nuevo);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ mensaje: "✅ Registro YEGO procesado exitosamente." });
});

app.get('/consultar/:t', (req, res) => {
    const db = leerDB();
    const t = req.params.t.toUpperCase();
    const r = db.find(i => i.v.placa.toUpperCase() === t || i.c.cc.toString() === t);
    if (r) res.json(r); else res.status(404).json({ error: "No encontrado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 YEGO Online`));

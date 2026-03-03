const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ESTO REPARA EL ERROR "Cannot GET /"
app.use(express.static('.')); 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let baseDatos = []; // Memoria temporal

app.post('/guardar', (req, res) => {
    const data = req.body;
    const index = baseDatos.findIndex(i => i.v.placa === data.v.placa);
    index !== -1 ? baseDatos[index] = data : baseDatos.push(data);
    res.json({ mensaje: "Guardado en Render" });
});

app.get('/listar', (req, res) => res.json(baseDatos));

app.get('/consultar/:placa', (req, res) => {
    const registro = baseDatos.find(i => i.v.placa === req.params.placa.toUpperCase());
    registro ? res.json(registro) : res.status(404).send("No existe");
});

app.get('/descargar-pdf/:placa', (req, res) => {
    const d = baseDatos.find(i => i.v.placa === req.params.placa.toUpperCase());
    if (!d) return res.status(404).send("No encontrado");

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Ficha_${d.v.placa}.pdf`);
    doc.pipe(res);

    // Diseño del PDF
    doc.rect(30, 30, 535, 35).fill('#002d5a');
    doc.fillColor('white').fontSize(16).text('YEGO LOGÍSTICA - SEGURIDAD OPERATIVA', 30, 42, { align: 'center' });
    
    doc.fillColor('black').fontSize(10).moveDown(2);
    doc.text(`PLACA: ${d.v.placa} | MARCA: ${d.v.marca} | MODELO: ${d.v.modelo} | COLOR: ${d.v.color}`);
    doc.text(`LÍNEA: ${d.v.linea || ''} | CHASIS: ${d.v.chasis || ''} | MOTOR: ${d.v.motor || ''}`);
    doc.moveDown().text(`GPS PROVEEDOR: ${d.v.gps_co || ''} | USUARIO: ${d.v.user || ''}`);
    doc.moveDown().text('--- DATOS CONDUCTOR ---');
    doc.text(`NOMBRE: ${d.c.nom} | CC: ${d.c.cc} | TEL: ${d.c.cel}`);
    doc.text(`LICENCIA: ${d.c.lic} | VENCIMIENTO: ${d.c.venc_lic}`);
    doc.moveDown().text('--- REFERENCIAS ---');
    doc.text(`LABORAL: ${d.r?.e1 || ''} - TEL: ${d.r?.t1 || ''}`);
    doc.text(`PERSONAL: ${d.r?.per || ''} - TEL: ${d.r?.tp || ''}`);

    doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto " + PORT));

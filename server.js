const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos en memoria (Se reinicia si el servidor se apaga)
let baseDatos = [];

// GUARDAR O ACTUALIZAR
app.post('/guardar', (req, res) => {
    const data = req.body;
    const index = baseDatos.findIndex(i => i.v.placa === data.v.placa);
    if (index !== -1) {
        baseDatos[index] = data;
    } else {
        baseDatos.push(data);
    }
    res.json({ mensaje: "Sincronizado con éxito" });
});

// LISTAR
app.get('/listar', (req, res) => res.json(baseDatos));

// CONSULTAR POR PLACA
app.get('/consultar/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    const registro = baseDatos.find(i => i.v.placa === placa);
    if (!registro) return res.status(404).json({ error: "No encontrado" });
    res.json(registro);
});

// ELIMINAR
app.delete('/eliminar/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    baseDatos = baseDatos.filter(i => i.v.placa !== placa);
    res.json({ mensaje: "Eliminado" });
});

// GENERADOR DE PDF PROFESIONAL (YEGO COMPLETO)
app.get('/descargar-pdf/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    const d = baseDatos.find(i => i.v.placa === placa);

    if (!d) return res.status(404).send("Registro no encontrado");

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FICHA_YEGO_${placa}.pdf`);
    doc.pipe(res);

    // Encabezado
    doc.rect(40, 40, 520, 30).fill('#002d5a');
    doc.fillColor('white').fontSize(14).text('YEGO LOGÍSTICA - FICHA DE SEGURIDAD OPERATIVA', 50, 50, { align: 'center' });

    // I. VEHÍCULO
    doc.moveDown(2).fillColor('#27ae60').fontSize(11).text('I. INFORMACIÓN TÉCNICA Y GPS', { underline: true });
    doc.fillColor('black').fontSize(9).moveDown(0.5);
    doc.text(`PLACA: ${d.v.placa} | MARCA: ${d.v.marca} | MODELO: ${d.v.modelo} | COLOR: ${d.v.color}`);
    doc.text(`LÍNEA: ${d.v.linea || 'N/A'} | MOTOR: ${d.v.motor || 'N/A'} | CHASIS: ${d.v.chasis || 'N/A'}`);
    doc.text(`CARROCERÍA: ${d.v.carro || 'N/A'} | CIUDAD: ${d.v.ciudad || 'N/A'} | COMBUSTIBLE: ${d.v.combust || 'N/A'}`);
    doc.text(`GPS PROVEEDOR: ${d.v.gps_co || 'N/A'} | USUARIO: ${d.v.user || 'N/A'} | CLAVE: ${d.v.pass || 'N/A'}`);
    doc.text(`VENC. SOAT: ${d.v.soat} | VENC. TECNO: ${d.v.tecno}`);

    // II. CONDUCTOR
    doc.moveDown(1.5).fillColor('#27ae60').fontSize(11).text('II. DATOS DEL CONDUCTOR', { underline: true });
    doc.fillColor('black').fontSize(9).moveDown(0.5);
    doc.text(`NOMBRE: ${d.c.nom} | CÉDULA: ${d.c.cc} | CELULAR: ${d.c.cel}`);
    doc.text(`LICENCIA: ${d.c.lic} | CATEGORÍA: ${d.c.cat || 'N/A'} | VENCIMIENTO: ${d.c.venc_lic}`);
    doc.text(`EPS: ${d.c.eps || 'N/A'} | ARL: ${d.c.arl || 'N/A'} | VENC. PLANILLA: ${d.c.venc_planilla || 'N/A'}`);
    doc.text(`DIRECCIÓN: ${d.c.dir || 'N/A'}`);

    // IV. REFERENCIAS
    doc.moveDown(1.5).fillColor('#27ae60').fontSize(11).text('IV. REFERENCIAS DE SEGURIDAD', { underline: true });
    doc.fillColor('black').fontSize(9).moveDown(0.5);
    doc.text(`LABORAL 1: ${d.r?.e1 || 'N/A'} - TEL: ${d.r?.t1 || 'N/A'}`);
    doc.text(`LABORAL 2: ${d.r?.e2 || 'N/A'} - TEL: ${d.r?.t2 || 'N/A'}`);
    doc.text(`PERSONAL: ${d.r?.per || 'N/A'} - TEL: ${d.r?.tp || 'N/A'}`);

    doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Node activo en puerto ${PORT}`));

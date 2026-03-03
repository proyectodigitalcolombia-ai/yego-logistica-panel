const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN PARA RENDER: SIRVE EL HTML Y EVITA EL "CANNOT GET /"
app.use(express.static('.')); 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let baseDatos = []; // Almacenamiento temporal en RAM

// RUTA PARA GUARDAR O ACTUALIZAR REGISTROS
app.post('/guardar', (req, res) => {
    const data = req.body;
    if (!data.v || !data.v.placa) return res.status(400).json({ error: "Placa requerida" });
    
    const index = baseDatos.findIndex(i => i.v.placa === data.v.placa.toUpperCase());
    if (index !== -1) {
        baseDatos[index] = data;
    } else {
        baseDatos.push(data);
    }
    res.json({ mensaje: "Registro sincronizado en la nube de Render" });
});

// RUTA PARA LISTAR TODOS LOS VEHÍCULOS
app.get('/listar', (req, res) => {
    res.json(baseDatos);
});

// RUTA PARA CONSULTAR UNA PLACA ESPECÍFICA
app.get('/consultar/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    const registro = baseDatos.find(i => i.v.placa === placa);
    if (registro) {
        res.json(registro);
    } else {
        res.status(404).json({ error: "No encontrado" });
    }
});

// GENERADOR DE PDF PROFESIONAL CON PDFKIT
app.get('/descargar-pdf/:placa', (req, res) => {
    const placa = req.params.placa.toUpperCase();
    const d = baseDatos.find(i => i.v.placa === placa);

    if (!d) return res.status(404).send("Error: El registro no existe en el servidor.");

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FICHA_TECNICA_${placa}.pdf`);
    doc.pipe(res);

    // Encabezado Corporativo
    doc.rect(30, 30, 535, 40).fill('#002d5a');
    doc.fillColor('white').fontSize(16).text('YEGO LOGÍSTICA - FICHA DE SEGURIDAD', 30, 45, { align: 'center' });
    
    doc.fillColor('black').moveDown(2.5);

    // Sección I: Vehículo
    doc.fontSize(12).fillColor('#27ae60').text('I. INFORMACIÓN TÉCNICA DEL VEHÍCULO', { underline: true });
    doc.fillColor('black').fontSize(10).moveDown(0.5);
    doc.text(`PLACA: ${d.v.placa} | MARCA: ${d.v.marca} | MODELO: ${d.v.modelo}`);
    doc.text(`LÍNEA: ${d.v.linea || 'N/A'} | COLOR: ${d.v.color} | CLASE: ${d.v.clase || 'N/A'}`);
    doc.text(`CHASIS: ${d.v.chasis || 'N/A'} | MOTOR: ${d.v.motor || 'N/A'}`);
    doc.text(`GPS: ${d.v.gps_co || 'N/A'} | USUARIO: ${d.v.user || 'N/A'} | CLAVE: ${d.v.pass || 'N/A'}`);
    doc.text(`VENC. SOAT: ${d.v.soat} | VENC. TECNO: ${d.v.tecno}`);

    doc.moveDown(1.5);

    // Sección II: Conductor
    doc.fontSize(12).fillColor('#27ae60').text('II. DATOS DEL CONDUCTOR', { underline: true });
    doc.fillColor('black').fontSize(10).moveDown(0.5);
    doc.text(`NOMBRE: ${d.c.nom}`);
    doc.text(`CÉDULA: ${d.c.cc} | CELULAR: ${d.c.cel}`);
    doc.text(`LICENCIA: ${d.c.lic} | CATEGORÍA: ${d.c.cat || 'N/A'} | VENCIMIENTO: ${d.c.venc_lic}`);
    doc.text(`SEGURIDAD SOCIAL: EPS: ${d.c.eps || 'N/A'} | ARL: ${d.c.arl || 'N/A'}`);

    doc.moveDown(1.5);

    // Sección IV: Referencias
    doc.fontSize(12).fillColor('#27ae60').text('IV. REFERENCIAS Y CONTACTOS', { underline: true });
    doc.fillColor('black').fontSize(10).moveDown(0.5);
    doc.text(`LABORAL 1: ${d.r?.e1 || 'N/A'} - TEL: ${d.r?.t1 || 'N/A'}`);
    doc.text(`LABORAL 2: ${d.r?.e2 || 'N/A'} - TEL: ${d.r?.t2 || 'N/A'}`);
    doc.text(`PERSONAL: ${d.r?.per || 'N/A'} - TEL: ${d.r?.tp || 'N/A'}`);

    doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Yego activo en puerto ${PORT}`));

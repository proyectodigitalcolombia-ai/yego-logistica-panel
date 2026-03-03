const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN CRÍTICA: Esto sirve todos los archivos de la carpeta actual
app.use(express.static(__dirname));

// RUTA RAÍZ: Si entras a la URL, busca el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            res.status(500).send("Error: El archivo index.html no existe en el servidor. Revisa el nombre del archivo en GitHub.");
        }
    });
});

let baseDatos = [];

app.post('/guardar', (req, res) => {
    const data = req.body;
    const index = baseDatos.findIndex(i => i.v.placa === data.v.placa.toUpperCase());
    index !== -1 ? baseDatos[index] = data : baseDatos.push(data);
    res.json({ mensaje: "Sincronizado" });
});

app.get('/listar', (req, res) => res.json(baseDatos));

app.get('/consultar/:placa', (req, res) => {
    const d = baseDatos.find(i => i.v.placa === req.params.placa.toUpperCase());
    d ? res.json(d) : res.status(404).json({error: "No existe"});
});

app.get('/descargar-pdf/:placa', (req, res) => {
    const d = baseDatos.find(i => i.v.placa === req.params.placa.toUpperCase());
    if (!d) return res.status(404).send("No encontrado");

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Ficha_YEGO_${d.v.placa}.pdf`);
    doc.pipe(res);

    doc.rect(30, 30, 535, 40).fill('#002d5a');
    doc.fillColor('white').fontSize(16).text('YEGO LOGÍSTICA - SEGURIDAD', 30, 45, { align: 'center' });
    doc.fillColor('black').fontSize(10).moveDown(3);
    doc.text(`VEHÍCULO: ${d.v.placa} - ${d.v.marca} ${d.v.modelo}`);
    doc.text(`CONDUCTOR: ${d.c.nom} - CC: ${d.c.cc}`);
    doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));

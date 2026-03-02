const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 1. CONFIGURACIÓN DE MIDDLEWARES
app.use(cors());
app.use(express.json());

// 2. SERVIR ARCHIVOS ESTÁTICOS (ESTO ARREGLA LA PANTALLA EN BLANCO)
// Esta línea le dice a Express que busque el index.html en la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 3. RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. RUTA PARA IMPORTAR EXCEL (Mapeo según tu archivo)
app.post('/importar', upload.single('archivo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convertimos a matriz (filas y columnas)
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Mapeo basado en la estructura de tu "base de datos.xls"
        // Nota: Los índices empiezan en 0 (Fila 1 = 0, Fila 2 = 1...)
        const info = {
            vehiculo: {
                placa: data[2] ? data[2][3] : '',       // Fila 3, Columna D
                marca: data[2] ? data[2][5] : '',       // Fila 3, Columna F
                usuario_gps: data[5] ? data[5][4] : '', // Fila 6, Columna E
                clave_gps: data[5] ? data[5][6] : ''    // Fila 6, Columna G
            },
            conductor: {
                nombre: data[8] ? data[8][2] : '',      // Fila 9, Columna C
                cedula: data[8] ? data[8][4] : ''       // Fila 9, Columna E
            }
        };

        // Borrar el archivo temporal para no llenar el servidor
        fs.unlinkSync(req.file.path);

        console.log("✅ Datos procesados con éxito");
        res.json(info);

    } catch (error) {
        console.error("❌ Error procesando Excel:", error);
        res.status(500).json({ error: "Error interno al procesar el archivo" });
    }
});

// 5. INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor YEGO corriendo en el puerto ${PORT}`);
    console.log(`📂 Buscando archivos en: ${path.join(__dirname, 'public')}`);
});

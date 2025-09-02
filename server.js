const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

// Carpeta para uploads y convertidos
const uploadFolder = path.join(__dirname, 'uploads');
const convertedFolder = path.join(__dirname, 'converted');

// Asegurarse de que existan las carpetas
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);
if (!fs.existsSync(convertedFolder)) fs.mkdirSync(convertedFolder);

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Servir archivos estáticos
app.use(express.static('public'));

// Endpoint de conversión
app.post('/convert', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No se subió ningún archivo.');

    const inputPath = req.file.path;
    const outputFileName = path.parse(req.file.filename).name + '.mp3';
    const outputPath = path.join(convertedFolder, outputFileName);

    ffmpeg(inputPath)
        .toFormat('mp3')
        .on('error', (err) => {
            console.error('Error de FFmpeg:', err);
            res.status(500).send('Ocurrió un error durante la conversión.');
        })
        .on('end', () => {
            res.download(outputPath, outputFileName, () => {
                // Limpiar archivo subido y convertido
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .save(outputPath);
});

// Iniciar servidor
app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));

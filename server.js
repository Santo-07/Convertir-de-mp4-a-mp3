const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;

// ------------------------------
// CONFIGURAR FFmpeg
// ------------------------------
const ffmpegPath = "C:\\Users\\santo\\Downloads\\ffmpeg\\ffmpeg\\bin\\ffmpeg.exe";
ffmpeg.setFfmpegPath(ffmpegPath);

// ------------------------------
// Carpetas necesarias
// ------------------------------
const uploadsDir = path.resolve(__dirname, 'uploads');
const convertedDir = path.resolve(__dirname, 'converted');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

// ------------------------------
// Servir archivos estáticos (frontend)
// ------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// ------------------------------
// Configurar multer para subir archivos
// ------------------------------
const upload = multer({ dest: uploadsDir });

// ------------------------------
// WebSocket: progreso
// ------------------------------
let sockets = [];
wss.on('connection', (ws) => {
    sockets.push(ws);
    ws.on('close', () => {
        sockets = sockets.filter(s => s !== ws);
    });
});

// ------------------------------
// Endpoint de conversión
// ------------------------------
app.post('/convert', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No se subió ningún archivo.');

    const inputFile = path.resolve(req.file.path);
    const outputFile = path.resolve(convertedDir, `${req.file.filename}.mp3`);

    console.log('Archivo de entrada:', inputFile);
    console.log('Archivo de salida:', outputFile);

    ffmpeg(inputFile)
        .toFormat('mp3')
        .on('progress', (p) => {
            const percent = Math.floor(p.percent);
            sockets.forEach(ws => ws.send(JSON.stringify({ progress: percent })));
        })
        .on('end', () => {
            res.download(outputFile, 'audio.mp3', () => {
                try { fs.unlinkSync(inputFile); } catch(e) {}
                try { fs.unlinkSync(outputFile); } catch(e) {}
            });
        })
        .on('error', (err) => {
            console.error('Error de FFmpeg:', err.message);
            res.status(500).send('Error al convertir el archivo: ' + err.message);
        })
        .save(outputFile);
});

// ------------------------------
// Iniciar servidor
// ------------------------------
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

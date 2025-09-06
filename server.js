require('dotenv').config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { OpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configurar ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Carpetas temporales
const uploadDir = path.join(__dirname, "uploads");
const convertedDir = path.join(__dirname, "converted");
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(convertedDir, { recursive: true });

// Multer para subida de archivos
const upload = multer({ dest: uploadDir });

// Servir archivos estáticos desde la raíz
app.use(express.static(__dirname));

// Endpoint para transcribir MP4 a texto
app.post("/transcribe", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No se subió ningún archivo.");

  const inputPath = req.file.path;
  const outputPath = path.join(convertedDir, req.file.filename + ".wav");

  try {
    // Convertir MP4 a WAV
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    // Transcribir con OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(outputPath),
      model: "whisper-1"
    });

    res.json({ text: transcription.text });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al transcribir el archivo.");
  } finally {
    try { fs.unlinkSync(inputPath); } catch {}
    try { fs.unlinkSync(outputPath); } catch {}
  }
});

// Iniciar servidor
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

// Timeouts largos para archivos grandes
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;


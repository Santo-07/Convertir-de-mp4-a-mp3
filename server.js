const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);
console.log("FFmpeg path:", ffmpegPath);

// Servir archivos estáticos
app.use(express.static("public"));

// Crear carpetas temporales
const uploadDir = path.join(__dirname, "tmp/uploads");
const outputDir = path.join(__dirname, "tmp");
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

// Configuración de Multer
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 200 * 1024 * 1024 } // 200 MB máximo
});

// Endpoint de conversión
app.post("/convert", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No se subió ningún archivo.");

  const inputPath = req.file.path;
  const outputPath = path.join(outputDir, `${req.file.filename}.mp3`);

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", () => {
      res.download(outputPath, "audio.mp3", () => {
        try { fs.unlinkSync(inputPath); } catch {}
        try { fs.unlinkSync(outputPath); } catch {}
      });
    })
    .on("error", (err) => {
      console.error("Error en la conversión:", err);
      res.status(500).send("Error al convertir el archivo.");
    })
    .save(outputPath);
});

// Servidor con host 0.0.0.0 y timeouts largos
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

server.keepAliveTimeout = 120000; // 120 s
server.headersTimeout = 120000;   // 120 s

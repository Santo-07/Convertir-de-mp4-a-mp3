const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

ffmpeg.setFfmpegPath(ffmpegPath);
app.use(express.static("public"));

const uploadDir = path.join(__dirname, "tmp/uploads");
const outputDir = path.join(__dirname, "tmp");
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

const upload = multer({ dest: uploadDir });

app.post("/convert", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No se subió ningún archivo.");

  const inputPath = req.file.path;
  const outputPath = path.join(outputDir, `${req.file.filename}.mp3`);

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", () => {
      res.download(outputPath, "audio.mp3", () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on("error", (err) => {
      console.error("Error en la conversión:", err);
      res.status(500).send("Error al convertir el archivo.");
    })
    .save(outputPath);
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


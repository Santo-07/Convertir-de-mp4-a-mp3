const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));

// Carpeta temporal en Render (no persistente)
const upload = multer({ dest: "/tmp/uploads" });

app.post("/convert", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se subió ningún archivo.");
  }

  const inputPath = req.file.path;
  const outputPath = `/tmp/${req.file.filename}.mp3`;

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", () => {
      res.download(outputPath, "output.mp3", (err) => {
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


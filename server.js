const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const convertBtn = document.getElementById('convert-btn');
const progressBar = document.getElementById('progress-bar');
const status = document.getElementById('status');
let selectedFile = null;

// Manejo de arrastrar y soltar
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => e.preventDefault());
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length > 0) {
    fileInput.files = e.dataTransfer.files;
    handleFile(fileInput.files[0]);
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (file.type !== "video/mp4") {
    status.textContent = "Por favor, selecciona un archivo MP4 válido.";
    convertBtn.disabled = true;
    return;
  }
  selectedFile = file;
  status.textContent = `Archivo listo: ${file.name}`;
  convertBtn.disabled = false;
}

// Botón de conversión
convertBtn.addEventListener('click', async () => {
  if (!selectedFile) return;
  convertBtn.disabled = true;
  status.textContent = "⏳ Convirtiendo...";
  progressBar.style.width = '0%';

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const response = await fetch('/convert', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(await response.text());

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio.mp3';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    status.textContent = "✅ Conversión completada.";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Ocurrió un error durante la conversión.";
  } finally {
    convertBtn.disabled = false;
  }
});


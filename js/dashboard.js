// 🔐 Validar sesión
window.onload = function () {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "index.html";
  } else {
    initUploadEvents(); // 🔥 IMPORTANTE
    loadFiles();
  }
};

// 📂 Estado global
let currentFolder = null;
let selectedFile = null;

// ===============================
// 📂 CARGAR ARCHIVOS
// ===============================
function loadFiles(folderId = null) {

  currentFolder = folderId;

  let url = `${API_URL}?action=getDriveItems`;
  if (folderId) url += `&folderId=${folderId}`;

  document.querySelector(".breadcrumb").innerText =
    folderId ? "Carpeta" : "Inicio";

  fetch(url)
    .then(res => res.json())
    .then(data => {

      let html = '<div class="grid">';

      data.forEach(item => {

        if (item.type === "back") {
          html += `
            <div class="card folder" onclick="loadFiles('${item.id}')">
              <div class="icon">⬅</div>
              <p>${item.name}</p>
            </div>
          `;
        }

        else if (item.type === "folder") {
          html += `
            <div class="card folder" onclick="loadFiles('${item.id}')">
              <div class="icon">📁</div>
              <p class="tooltip" data-name="${item.name}">${item.name}</p>
            </div>
          `;
        }

        else {
          html += `
            <div class="card file">
              <div class="icon">📄</div>
              <p class="tooltip" data-name="${item.name}">${item.name}</p>

              <div class="actions">
                <button onclick="previewFile('${item.url}')">Ver</button>
                <button onclick="downloadFile('${item.download}')">Descargar</button>
              </div>
            </div>
          `;
        }

      });

      html += '</div>';
      document.querySelector(".files").innerHTML = html;
    });
}

// ===============================
// 📂 UPLOAD MODAL
// ===============================

function openUploadModal() {
  document.getElementById("uploadModal").style.display = "flex";
}

function closeUploadModal() {
  document.getElementById("uploadModal").style.display = "none";
  selectedFile = null;
  document.getElementById("fileInfo").style.display = "none";
}

// 🔥 INICIALIZAR EVENTOS
function initUploadEvents() {

  const fileInput = document.getElementById("fileInputHidden");
  const dropZone = document.getElementById("dropZone");

  // 📂 INPUT
  fileInput.addEventListener("change", function (e) {
    if (e.target.files.length > 0) {
      selectedFile = e.target.files[0];
      showFileInfo(selectedFile);
    }
  });

  // 🖱 DRAG
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    if (e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
      showFileInfo(selectedFile);
    }
  });
}

// 📄 Mostrar archivo
function showFileInfo(file) {
  document.getElementById("fileInfo").style.display = "block";
  document.getElementById("fileName").innerText = file.name;
}

// 🚀 SUBIR ARCHIVO
function confirmUpload() {

  if (!selectedFile) {
    alert("Selecciona un archivo primero");
    return;
  }

  // 🔥 LIMITE (IMPORTANTE)
  if (selectedFile.size > 5 * 1024 * 1024) {
    alert("Archivo demasiado grande (máx 5MB)");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {

    const base64 = reader.result.split(",")[1];

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "uploadFile",
        file: base64,
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        folderId: currentFolder,
        usuario: JSON.parse(localStorage.getItem("user")).nombre
      })
    })
    .then(res => res.json())
    .then(data => {

      console.log("RESPUESTA:", data);

      if (data.status === "success") {
        alert("Archivo subido correctamente");

        closeUploadModal();
        loadFiles(currentFolder);

      } else {
        alert("Error: " + data.message);
      }

    })
    .catch(err => {
      console.error(err);
      alert("Error de conexión");
    });

  };

  reader.readAsDataURL(selectedFile);
}
// ===============================
// UTILIDADES
// ===============================
function previewFile(url) {
  window.open(url, "_blank");
}

function downloadFile(url) {
  window.open(url, "_blank");
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

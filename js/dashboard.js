// 🔐 Validar sesión y cargar archivos
window.onload = function () {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "index.html";
  } else {
    loadFiles();
  }
};

// 📂 Estado global
let currentFolder = null;
let selectedFile = null;

// 📂 Cargar archivos como tarjetas
function loadFiles(folderId = null) {

  currentFolder = folderId;

  let url = `${API_URL}?action=getDriveItems`;
  if (folderId) {
    url += `&folderId=${folderId}`;
  }

  // Breadcrumb
  document.querySelector(".breadcrumb").innerText = folderId ? "Carpeta" : "Inicio";

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

    })
    .catch(err => {
      console.error(err);
      document.querySelector(".files").innerHTML = "Error cargando archivos";
    });
}

// 👁 Vista previa
function previewFile(url) {
  window.open(url, "_blank");
}

// ⬇ Descargar
function downloadFile(url) {
  window.open(url, "_blank");
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// =============================
// 🔥 MODAL SUBIDA PROFESIONAL
// =============================

// 🔓 Abrir modal
function openUploadModal() {
  document.getElementById("uploadModal").style.display = "flex";
}

// 🔒 Cerrar modal
function closeUploadModal() {
  document.getElementById("uploadModal").style.display = "none";

  // Reset
  selectedFile = null;
  document.getElementById("fileInfo").style.display = "none";
}

// 📂 Configurar eventos (IMPORTANTE)
document.addEventListener("DOMContentLoaded", function () {

  const fileInput = document.getElementById("fileInputHidden");
  const dropZone = document.getElementById("dropZone");

  // 📂 Selección desde botón
  fileInput.addEventListener("change", function (e) {
    if (e.target.files.length > 0) {
      selectedFile = e.target.files[0];
      showFileInfo(selectedFile);
    }
  });

  // 🖱 Drag & Drop
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

});

// 🔍 Mostrar archivo seleccionado
function showFileInfo(file) {
  document.getElementById("fileInfo").style.display = "block";
  document.getElementById("fileName").innerText = file.name;
}

// 🚀 Subir archivo (BOTÓN FUNCIONAL)
function confirmUpload() {

  console.log("Subiendo archivo...");

  if (!selectedFile) {
    alert("Selecciona un archivo primero");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {

    const base64 = reader.result.split(",")[1];

    fetch(API_URL, {
      method: "POST",
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
    .then(() => {

      alert("Archivo subido correctamente");

      closeUploadModal();
      loadFiles(currentFolder);

    })
    .catch(err => {
      console.error(err);
      alert("Error al subir archivo");
    });

  };

  reader.readAsDataURL(selectedFile);
}

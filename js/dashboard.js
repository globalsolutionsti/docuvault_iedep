// 🔐 Validar sesión y cargar archivos
window.onload = function () {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "index.html";
  } else {
    loadFiles(); // 📁 raíz
  }
};

// 📂 Cargar archivos como tarjetas
let currentFolder = null; // 📁 estado global

function loadFiles(folderId = null) {

  currentFolder = folderId;

  let url = `${API_URL}?action=getDriveItems`;

  if (folderId) {
    url += `&folderId=${folderId}`;
  }
if (!folderId) {
  document.querySelector(".breadcrumb").innerText = "Inicio";
}
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

// 📤 Subir archivo
function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Selecciona un archivo");
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
        fileName: file.name,
        mimeType: file.type,
        folderId: currentFolder // 🔥 clave
      })
    })
    .then(res => res.json())
    .then(() => {
      alert("Archivo subido");
      loadFiles(currentFolder);
    });
  };

  reader.readAsDataURL(file);
}

// 👁 Vista previa
function previewFile(url) {
  window.open(url, "_blank");
}

// ⬇ Descargar
function downloadFile(url) {
  window.open(url, "_blank");
}

// 📂 Navegar carpeta (fase siguiente)
function openFolder(id) {
  alert("Entrar a carpeta (fase 5)");
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
// 🔥 ABRIR MODAL
function openUploadModal() {
  document.getElementById("uploadModal").style.display = "flex";
}

// ❌ CERRAR MODAL
function closeUploadModal() {
  document.getElementById("uploadModal").style.display = "none";
}

// 📂 INPUT FILE
document.addEventListener("DOMContentLoaded", function () {

  const fileInput = document.getElementById("fileInputHidden");

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      handleFileUpload(fileInput.files[0]);
    });
  }

  const dropZone = document.getElementById("dropZone");

  if (dropZone) {

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

      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    });
  }

});

// 🚀 SUBIDA CENTRAL
function handleFileUpload(file) {

  if (!file) {
    alert("Selecciona un archivo");
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
        fileName: file.name,
        mimeType: file.type,
        folderId: currentFolder,
        usuario: JSON.parse(localStorage.getItem("user")).nombre
      })
    })
    .then(res => res.json())
    .then(() => {
      alert("Archivo subido correctamente");
      closeUploadModal();
      loadFiles(currentFolder);
    });

  };

  reader.readAsDataURL(file);
}

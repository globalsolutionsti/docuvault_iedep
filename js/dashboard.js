// 🔐 Validar sesión y cargar archivos
window.onload = function () {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "index.html";
  } else {
    loadFiles();
  }
};

// 📂 Cargar archivos como tarjetas
function loadFiles() {
  fetch(`${API_URL}?action=getDriveItems`)
    .then(res => res.json())
    .then(data => {

      console.log("Archivos:", data); // DEBUG

      let html = '<div class="grid">';

      data.forEach(item => {

        if (item.type === "folder") {
          html += `
            <div class="card folder" onclick="openFolder('${item.id}')">
              <div class="icon">📁</div>
             <p class="tooltip" data-name="${item.name}">${item.name}</p>
            </div>
          `;
        } else {
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
        usuario: JSON.parse(localStorage.getItem("user")).nombre
      })
    })
    .then(res => res.json())
    .then(() => {
      alert("Archivo subido correctamente");
      loadFiles();
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

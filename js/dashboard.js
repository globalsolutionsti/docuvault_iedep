// 🔐 Validar sesión
window.onload = function () {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "index.html";
  } else {
    loadHome();
  }
};

// 🔄 Cargar inicio
function loadHome() {
  document.querySelector(".files").innerHTML = `
    <h3>Bienvenido</h3>
    <p>Selecciona una opción del menú para comenzar</p>
  `;
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
function loadFiles() {
  fetch(`${API_URL}?action=getDriveItems`)
    .then(res => res.json())
    .then(data => {

      let html = '<div class="grid">';

      data.forEach(item => {

        if (item.type === "folder") {
          html += `
            <div class="card folder" onclick="openFolder('${item.id}')">
              <div class="icon">📁</div>
              <p>${item.name}</p>
            </div>
          `;
        } else {
          html += `
            <div class="card file">
              <div class="icon">📄</div>
              <p>${item.name}</p>

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
function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

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
      alert("Archivo subido");
      loadFiles();
    });
  };

  reader.readAsDataURL(file);
}
function deleteFile(id) {
  fetch(`${API_URL}?action=deleteFile&id=${id}`)
    .then(() => loadFiles());
}

window.onload = function () {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "index.html";
  } else {
    loadFiles();
  }
};
// 👁 Vista previa
function previewFile(url) {
  window.open(url, "_blank");
}

// ⬇ Descargar
function downloadFile(url) {
  window.open(url, "_blank");
}

// 📂 Navegar carpetas (fase siguiente)
function openFolder(id) {
  alert("Entrar a carpeta (siguiente fase)");
}

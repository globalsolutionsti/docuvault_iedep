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
            <div class="card folder">
              📁
              <p>${item.name}</p>
            </div>
          `;
        } else {
          html += `
            <div class="card file">
              📄
              <p>${item.name}</p>
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

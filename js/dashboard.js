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
  fetch(`${API_URL}?action=getFiles`)
    .then(res => res.json())
    .then(data => {
      let html = "<table><tr><th>Nombre</th><th>Versión</th><th>Acciones</th></tr>";

      data.forEach(file => {
        html += `
          <tr>
            <td>${file.nombre}</td>
            <td>${file.version}</td>
            <td>
              <button onclick="deleteFile(${file.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });

      html += "</table>";

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

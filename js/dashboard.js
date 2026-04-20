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

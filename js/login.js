const API_URL = "https://script.google.com/macros/s/AKfycbzn04jKFTAARVpRbax4qrCyE5nnT3acrpV6TzFA4P47avLtXSV4esaVepPRQcv5obM/exec";

function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const url = `${API_URL}?action=login&usuario=${usuario}&password=${password}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("error").innerText = data.message;
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("error").innerText = "Error de conexión";
    });
}

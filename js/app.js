const API_URL = "https://script.google.com/macros/s/AKfycbyyHb26M_W7igJ1Isk2hjJG53ePpxQPNrc0vezA3l3eEcCUF6FWjg2xg7YM369b3T_D/exec";


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

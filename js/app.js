const API_URL = "https://script.google.com/macros/s/AKfycbzc1FpODqdfk0BSdaLVWguzRI3tbrEnuUeKFA8ZNHxyzJU3bOduyFXsXXomjftebhXU/exec";

function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      usuario: usuario,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      
      // Guardar sesión
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir (siguiente fase)
      window.location.href = "dashboard.html";

    } else {
      document.getElementById("error").innerText = data.message;
    }
  });
}

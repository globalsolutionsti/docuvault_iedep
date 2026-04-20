const API_URL = "https://script.google.com/macros/s/AKfycbyUy1NhZSX1BWKFA3mDRcs8o3FUbfYyYFzkuq8VpnbPqhYRykpqF2G1mLYPeM2l5O6t/exec";


function login(usuario, password) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(HOJA_USUARIOS);

  if (!sheet) {
    return { status: "error", message: "Hoja no encontrada" };
  }

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {

    let userSheet = String(rows[i][1]).trim();
    let passSheet = String(rows[i][2]).trim();
    let estado = String(rows[i][5]).trim();

    if (
      userSheet === String(usuario).trim() &&
      passSheet === String(password).trim() &&
      estado.toLowerCase() === "activo"
    ) {
      return {
        status: "success",
        user: {
          id: rows[i][0],
          nombre: rows[i][3],
          rol: rows[i][4]
        }
      };
    }
  }

  return {
    status: "error",
    message: "Usuario o contraseña incorrectos"
  };
}

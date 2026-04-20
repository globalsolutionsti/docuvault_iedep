const API_URL = "https://script.google.com/macros/s/AKfycbyyHb26M_W7igJ1Isk2hjJG53ePpxQPNrc0vezA3l3eEcCUF6FWjg2xg7YM369b3T_D/exec";


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

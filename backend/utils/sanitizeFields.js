// Sanitização dos dados inseridos no body, para capturar possíveis tentativas de Injeção de Código ou XSS
const sanitizeFields = (list) => {
  return list.map((field) => {
    return field.replace(/[<>&"']/g, "");
  });
};

module.exports = sanitizeFields;

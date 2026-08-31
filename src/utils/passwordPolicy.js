const MIN_LENGTH = 12;

const COMMON_PASSWORDS = new Set([
  "password",
  "12345678",
  "123456789",
  "qwerty123",
  "contraseña",
  "contrasena",
  "admin123",
  "letmein",
  "welcome1",
  "changeme",
  "cambiar-esta-clave",
]);

export const PASSWORD_RULES = [
  { key: "length", label: `Al menos ${MIN_LENGTH} caracteres`, test: (p) => p.length >= MIN_LENGTH },
  { key: "lower", label: "Una letra minúscula", test: (p) => /[a-z]/.test(p) },
  { key: "upper", label: "Una letra mayúscula", test: (p) => /[A-Z]/.test(p) },
  { key: "number", label: "Un número", test: (p) => /[0-9]/.test(p) },
  { key: "symbol", label: "Un símbolo (ej. ! @ # $ %)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function validatePassword(password, { email, name } = {}) {
  const pwd = String(password || "");
  const errors = [];

  for (const rule of PASSWORD_RULES) {
    if (!rule.test(pwd)) errors.push(rule.label);
  }

  if (COMMON_PASSWORDS.has(pwd.toLowerCase())) {
    errors.push("No puede ser una contraseña demasiado común");
  }

  const lowerPwd = pwd.toLowerCase();
  const emailUser = email ? String(email).split("@")[0].toLowerCase() : "";
  if (emailUser && emailUser.length > 2 && lowerPwd.includes(emailUser)) {
    errors.push("No puede contener tu email");
  }
  if (name && name.trim().length > 2 && lowerPwd.includes(name.trim().toLowerCase())) {
    errors.push("No puede contener tu nombre");
  }

  return { valid: errors.length === 0, errors };
}

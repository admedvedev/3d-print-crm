// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Проверка языка пароля (только латиница)
export const isPasswordLatin = (password: string): boolean => {
  const latinRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]*$/;
  return latinRegex.test(password);
};

// Проверка сложности пароля
export const getPasswordStrength = (password: string): {
  score: number;
  message: string;
  isValid: boolean;
} => {
  let score = 0;
  const messages: string[] = [];

  // Длина пароля
  if (password.length >= 8) {
    score += 1;
  } else {
    messages.push("минимум 8 символов");
  }

  // Наличие строчных букв
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    messages.push("строчные буквы (a-z)");
  }

  // Наличие заглавных букв
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    messages.push("заглавные буквы (A-Z)");
  }

  // Наличие цифр
  if (/\d/.test(password)) {
    score += 1;
  } else {
    messages.push("цифры (0-9)");
  }

  // Наличие специальных символов
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    score += 1;
  } else {
    messages.push("специальные символы (!@#$%^&*...)");
  }

  // Проверка на кириллицу
  if (/[а-яё]/i.test(password)) {
    messages.push("только латинские символы");
    return { score: 0, message: "Пароль должен содержать только латинские символы", isValid: false };
  }

  const isValid = score >= 3 && messages.length === 0;
  const message = messages.length > 0 
    ? `Пароль должен содержать: ${messages.join(", ")}`
    : score >= 4 ? "Отличный пароль!" : "Хороший пароль";

  return { score, message, isValid };
};

// Валидация имени
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

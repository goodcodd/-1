// Функція валідації для форми додавання студента
export const validateStudent = (values) => {
  const errors = {};

  // Перевірка імені
  if (!values.name.trim()) {
    errors.name = "Ім'я є обов'язковим для заповнення";
  } else if (values.name.trim().length < 2) {
    errors.name = "Ім'я повинно містити принаймні 2 символи";
  }

  // Перевірка балів (від 0 до 100)
  if (values.score === "" || values.score === null || values.score === undefined) {
    errors.score = "Будь ласка, введіть бал";
  } else {
    const scoreNum = Number(values.score);
    if (isNaN(scoreNum)) {
      errors.score = "Бал повинен бути числом";
    } else if (scoreNum < 0 || scoreNum > 100) {
      errors.score = "Бал повинен бути числом від 0 до 100";
    }
  }

  return errors;
};



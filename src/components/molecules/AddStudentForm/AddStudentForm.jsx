import { useState, useMemo } from 'react';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import { validateStudent } from '../../../utils/validateStudent';
import styles from './AddStudentForm.module.css';

const AddStudentForm = ({ onAddStudent }) => {
  const [formData, setFormData] = useState({ name: '', score: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Типізація вводу для поля "Бал" - дозволяємо тільки цілі числа
    if (name === 'score') {
      // Дозволяємо порожній рядок або цілі числа від 0 до 100
      // Регулярний вираз: порожній рядок або числа від 0 до 100
      if (value === '' || /^(0|[1-9]\d?|100)$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      // Якщо не відповідає патерну - ігноруємо введення
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Очищення помилки під час введення (опціонально)
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Перевірка, чи форма валідна (для блокування кнопки)
  const isFormValid = useMemo(() => {
    const validationErrors = validateStudent(formData);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  // Перевірка, чи обов'язкові поля заповнені
  const areRequiredFieldsFilled = useMemo(() => {
    return formData.name.trim() !== '' && formData.score !== '';
  }, [formData]);

  // Кнопка disabled, якщо є помилки або обов'язкові поля не заповнені
  const isButtonDisabled = !isFormValid || !areRequiredFieldsFilled;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Виклик валідації перед відправкою
    const validationErrors = validateStudent(formData);
    
    if (Object.keys(validationErrors).length === 0) {
      // Якщо помилок немає — додаємо студента
      onAddStudent({
        id: Date.now(),
        name: formData.name.trim(),
        score: Number(formData.score),
        isActive: true
      });
      
      // Очищення форми
      setFormData({ name: '', score: '' });
      setErrors({});
    } else {
      // Відображення помилок
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>Додати нового студента</h3>
      
      <Input
        label="Прізвище та ім'я:"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Введіть ПІБ"
      />
      {/* Використання умовного рендерингу для помилок */}
      {errors.name && <p className={styles.error}>{errors.name}</p>}
      
      <Input
        label="Бал студента:"
        name="score"
        type="number"
        value={formData.score}
        onChange={handleChange}
        placeholder="0-100"
        min="0"
        max="100"
        step="1"
      />
      {errors.score && <p className={styles.error}>{errors.score}</p>}
      
      <Button 
        type="submit" 
        variant="primary"
        disabled={isButtonDisabled}
      >
        Додати студента
      </Button>
    </form>
  );
};

export default AddStudentForm;


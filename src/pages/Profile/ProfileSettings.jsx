import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'Student_KP',
    email: 'student@example.com',
    notifications: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Симуляція збереження налаштувань
    console.log('Налаштування збережено:', formData);
    
    // Програмне перенаправлення на головну сторінку
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Налаштування профілю</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Ім'я користувача:"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Введіть ім'я користувача"
        />

        <Input
          label="Email:"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Введіть email"
        />

        <div className={styles.checkboxWrapper}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span>Отримувати сповіщення на email</span>
          </label>
        </div>

        <div className={styles.actions}>
          <Button type="submit" variant="primary">
            Зберегти зміни
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;


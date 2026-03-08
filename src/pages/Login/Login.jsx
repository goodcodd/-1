import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (email.trim()) {
      setIsLoading(true);
      try {
        // Викликаємо асинхронну функцію login
        await login(email.trim());
        // Перенаправлення в профіль після успішного входу
        navigate('/profile', { replace: true });
      } catch (err) {
        setError('Помилка авторизації. Спробуйте ще раз.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вхід в систему</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Завантаження...' : 'Увійти'}
        </Button>
      </form>
      <p className={styles.hint}>
        Для демонстрації достатньо ввести будь-який коректний email.
      </p>
    </div>
  );
};

export default Login;




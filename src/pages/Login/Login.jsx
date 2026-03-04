import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim()) {
      // Імітація успішного логіну
      login({ email: email.trim() });
      // Перенаправлення в профіль
      navigate('/profile', { replace: true });
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
        />
        <Button type="submit" variant="primary">
          Увійти
        </Button>
      </form>
      <p className={styles.hint}>
        Для демонстрації достатньо ввести будь-який коректний email.
      </p>
    </div>
  );
};

export default Login;



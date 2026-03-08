import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Сторінку не знайдено</h2>
        <p className={styles.message}>
          Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.button}>
            Повернутися на головну
          </Link>
          <Link to="/feed" className={styles.buttonSecondary}>
            Перейти до стрічки
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;




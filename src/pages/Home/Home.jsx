import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Ласкаво просимо до React Lab!</h1>
        <p className={styles.subtitle}>
          Досліджуйте можливості React: компоненти, маршрутизацію та інтерактивні інтерфейси
        </p>
        <div className={styles.actions}>
          <Link to="/feed" className={styles.primaryButton}>
            Перейти до стрічки
          </Link>
          <Link to="/profile" className={styles.secondaryButton}>
            Мій профіль
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h3>📰 Стрічка новин</h3>
          <p>Переглядайте та фільтруйте пости з пошуком за автором або вмістом</p>
          <Link to="/feed" className={styles.link}>
            Відкрити стрічку →
          </Link>
        </div>

        <div className={styles.featureCard}>
          <h3>👤 Профіль</h3>
          <p>Керуйте своїм профілем та налаштуваннями акаунту</p>
          <Link to="/profile" className={styles.link}>
            Відкрити профіль →
          </Link>
        </div>

        <div className={styles.featureCard}>
          <h3>🔍 Динамічні маршрути</h3>
          <p>Переглядайте окремі пости за унікальним ідентифікатором</p>
          <Link to="/feed" className={styles.link}>
            Переглянути приклади →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;



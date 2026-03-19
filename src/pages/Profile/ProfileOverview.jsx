import useWindowSize from '../../hooks/useWindowSize';
import styles from './ProfileOverview.module.css';

const ProfileOverview = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Інформація профілю</h2>
      
      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Ім'я користувача:</span>
          <span className={styles.value}>Student_KP</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>student@example.com</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Дата реєстрації:</span>
          <span className={styles.value}>15 січня 2024</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Статус:</span>
          <span className={styles.value}>Активний</span>
        </div>
      </div>

      <div
        className={styles.stats}
        style={isMobile ? { gridTemplateColumns: '1fr' } : undefined}
      >
        <div className={styles.statCard}>
          <h3>Постів</h3>
          <p className={styles.statNumber}>12</p>
        </div>
        <div className={styles.statCard}>
          <h3>Лайків</h3>
          <p className={styles.statNumber}>156</p>
        </div>
        <div className={styles.statCard}>
          <h3>Коментарів</h3>
          <p className={styles.statNumber}>43</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;




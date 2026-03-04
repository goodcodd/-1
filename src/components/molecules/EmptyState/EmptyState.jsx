import styles from './EmptyState.module.css';

const EmptyState = ({ message = "Нічого не знайдено за вашим запитом." }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>🔍</div>
      <p className={styles.message}>{message}</p>
      <p className={styles.hint}>Спробуйте змінити параметри пошуку або вибрати іншу категорію</p>
    </div>
  );
};

export default EmptyState;



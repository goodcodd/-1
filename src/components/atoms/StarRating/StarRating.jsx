import styles from './StarRating.module.css';

const StarRating = ({ rating = 0, maxRating = 5, size = 'medium' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={styles.ratingContainer}>
      {Array.from({ length: maxRating }).map((_, index) => {
        if (index < fullStars) {
          return (
            <span key={index} className={`${styles.star} ${styles.filled} ${styles[size]}`}>
              ★
            </span>
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <span key={index} className={`${styles.star} ${styles.half} ${styles[size]}`}>
              ★
            </span>
          );
        } else {
          return (
            <span key={index} className={`${styles.star} ${styles.empty} ${styles[size]}`}>
              ★
            </span>
          );
        }
      })}
      <span className={styles.ratingText}>({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;


import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.filterWrapper}>
      <span className={styles.filterLabel}>Категорії:</span>
      <div className={styles.filterButtons}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`${styles.filterButton} ${
              activeCategory === category ? styles.active : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;


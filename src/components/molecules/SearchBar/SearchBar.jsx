import styles from './SearchBar.module.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        placeholder="Пошук постів за автором або вмістом..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className={styles.clearButton}
          aria-label="Очистити пошук"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;



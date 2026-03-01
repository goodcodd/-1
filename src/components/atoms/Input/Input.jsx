import styles from './Input.module.css';

const Input = ({ type = 'text', placeholder, label, value, onChange }) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={styles.input}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;


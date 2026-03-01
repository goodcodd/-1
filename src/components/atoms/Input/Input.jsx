import styles from './Input.module.css';

const Input = ({ type = 'text', placeholder, label, value, onChange, name, min, max, step }) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label} htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={styles.input}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default Input;


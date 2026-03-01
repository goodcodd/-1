import styles from './Button.module.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;


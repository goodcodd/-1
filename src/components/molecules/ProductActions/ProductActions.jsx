import styles from './ProductActions.module.css';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';

const ProductActions = ({ quantity, onQuantityChange, onBuy, maxQuantity = 10, disabled = false }) => {
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className={styles.productActions}>
      <div className={styles.quantitySection}>
        <label className={styles.quantityLabel}>Кількість:</label>
        <div className={styles.quantityControls}>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleDecrement}
            disabled={quantity <= 0 || disabled}
          >
            −
          </button>
          <div className={styles.quantityInputWrapper}>
            <Input
              type="number"
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min={0}
              max={maxQuantity}
            />
          </div>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity || disabled}
          >
            +
          </button>
        </div>
      </div>
      
      <div className={styles.buyButtonWrapper}>
        <Button
          variant="primary"
          onClick={onBuy}
          disabled={quantity === 0 || disabled}
        >
          Купити
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;


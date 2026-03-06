import { useState } from 'react';
import styles from './ProductContainer.module.css';
import Card from '../../molecules/Card/Card';
import ProductDetails from '../../molecules/ProductDetails/ProductDetails';
import ProductActions from '../../molecules/ProductActions/ProductActions';

const ProductContainer = ({ product }) => {
  // Стан кількості товару зберігається в контейнерному компоненті (Smart Component)
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleBuy = () => {
    if (quantity > 0) {
      alert(`Додано до кошика: ${product.title} x${quantity}`);
      // Тут була б логіка додавання до кошика
      setQuantity(0); // Скидаємо кількість після покупки
    }
  };

  return (
    <div className={styles.productContainer}>
      <Card>
        <ProductDetails
          image={product.image}
          title={product.title}
          description={product.description}
          price={product.price}
          rating={product.rating}
        />
        
        <ProductActions
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onBuy={handleBuy}
          maxQuantity={product.stock || 10}
        />
      </Card>
    </div>
  );
};

export default ProductContainer;


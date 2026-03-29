import { useState } from 'react';
import styles from './ProductContainer.module.css';
import Card from '../../molecules/Card/Card';
import ProductDetails from '../../molecules/ProductDetails/ProductDetails';
import ProductActions from '../../molecules/ProductActions/ProductActions';
import { useCartStore } from '../../../store/useStore';

const ProductContainer = ({ product }) => {
  // Локальна кількість для форми; глобальний кошик — у Zustand (див. useStore)
  const [quantity, setQuantity] = useState(0);
  const addToCart = useCartStore((s) => s.addToCart);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleBuy = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      setQuantity(0);
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


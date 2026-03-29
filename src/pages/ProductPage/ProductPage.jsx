import ProductContainer from '../../components/organisms/ProductContainer/ProductContainer';
import styles from './ProductPage.module.css';
import { useCartStore, selectTotalItems, selectTotalPrice } from '../../store/useStore';

function CartSummary() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  if (items.length === 0) {
    return (
      <p className={styles.cartEmpty} role="status">
        Кошик порожній. Оберіть кількість і натисніть «Купити».
      </p>
    );
  }

  return (
    <section className={styles.cartSummary} aria-label="Вміст кошика">
      <h2 className={styles.cartTitle}>Кошик ({totalItems} шт.)</h2>
      <ul className={styles.cartList}>
        {items.map((line) => (
          <li key={line.id} className={styles.cartLine}>
            <span>{line.title}</span>
            <span>
              {line.quantity} × {line.price} грн = {line.quantity * line.price} грн
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.cartTotal}>
        Разом: <strong>{totalPrice} грн</strong>
      </p>
      <button type="button" className={styles.clearCart} onClick={() => clearCart()}>
        Очистити кошик
      </button>
    </section>
  );
}

const ProductPage = () => {
  // Мок-дані товару (в реальному додатку це було б з API)
  const productData = {
    id: 1,
    title: 'Смартфон Samsung Galaxy S23',
    description: 'Потужний смартфон з 6.1" дисплеєм, процесором Snapdragon 8 Gen 2, камерою 50 МП та батареєю 3900 мАг. Ідеальний вибір для продуктивності та якості фото.',
    price: 24999,
    image: 'https://placehold.co/400x300/007bff/ffffff?text=Samsung+Galaxy+S23',
    rating: 4.5,
    stock: 15
  };

  return (
    <div className={styles.productPage}>
      <h1 className={styles.pageTitle}>Картка товару</h1>
      <CartSummary />
      <ProductContainer product={productData} />
    </div>
  );
};

export default ProductPage;



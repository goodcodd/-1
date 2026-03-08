import ProductContainer from '../../components/organisms/ProductContainer/ProductContainer';
import styles from './ProductPage.module.css';

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
      <ProductContainer product={productData} />
    </div>
  );
};

export default ProductPage;



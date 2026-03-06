import styles from './ProductDetails.module.css';
import StarRating from '../../atoms/StarRating/StarRating';
import Typography from '../../atoms/Typography/Typography';

const ProductDetails = ({ image, title, description, price, rating }) => {
  return (
    <div className={styles.productDetails}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
      </div>
      
      <div className={styles.content}>
        <Typography variant="h2" className={styles.title}>
          {title}
        </Typography>
        
        {rating !== undefined && (
          <div className={styles.ratingWrapper}>
            <StarRating rating={rating} maxRating={5} />
          </div>
        )}
        
        {description && (
          <Typography variant="body1" className={styles.description}>
            {description}
          </Typography>
        )}
        
        <div className={styles.priceContainer}>
          <Typography variant="h3" className={styles.price}>
            {typeof price === 'number' ? `${price.toFixed(2)} ₴` : price}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


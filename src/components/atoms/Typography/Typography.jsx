import styles from './Typography.module.css';

const Typography = ({ variant = 'body1', children, className = '' }) => {
  const Component = variant === 'h1' ? 'h1' : 
                    variant === 'h2' ? 'h2' : 
                    variant === 'h3' ? 'h3' : 
                    variant === 'h4' ? 'h4' : 
                    variant === 'h5' ? 'h5' : 
                    variant === 'h6' ? 'h6' : 'p';
  
  return (
    <Component className={`${styles[variant]} ${className}`}>
      {children}
    </Component>
  );
};

export default Typography;


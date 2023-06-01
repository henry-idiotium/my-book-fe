import styles from './product-item.module.css';

/* eslint-disable-next-line */
export interface ProductItemProps {}

export function ProductItem(props: ProductItemProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ProductItem!</h1>
    </div>
  );
}

export default ProductItem;

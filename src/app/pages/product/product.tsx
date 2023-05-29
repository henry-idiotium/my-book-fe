import { useEffect, useState } from 'react';

import styles from './product.module.css';

import { getProducts } from '@/api';
import { ProductEntity } from '@/types';

export function Product() {
  const [products, setProducts] = useState<ProductEntity[]>([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <>
      <div className={styles['container']}>
        <h1>Welcome to Product!</h1>
      </div>

      <div className="flex flex-col gap-6 mt-10">
        {products.length ? (
          products.map((p, i) => (
            <div className="product-item" key={i}>
              <p>
                id: <strong>{p.id}</strong>
              </p>
              <p>
                name: <strong>{p.name}</strong>
              </p>
            </div>
          ))
        ) : (
          <div className="">Loading...</div>
        )}
      </div>
    </>
  );
}

export default Product;

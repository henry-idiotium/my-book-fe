import { useEffect, useState } from 'react';

import { getProducts } from '@/api';
import { ProductEntity } from '@/types';

export function Product() {
  const [products, setProducts] = useState<ProductEntity[]>([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <>
      <div className="">
        <h1>Welcome to Product!</h1>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {products.length ? (
          products.map((p, i) => (
            <div key={i} className="product-item">
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

import { zocker } from 'zocker';

import { ProductEntity, productZod } from '@/types';

type GetProductProps = {
  id?: number;
  isFoo?: boolean;
};

export async function getProducts(_?: GetProductProps) {
  await new Promise((resolve) => {
    setTimeout(() => {
      const mess = 'product fetched!!';

      resolve(mess);
      console.log(mess);
    }, 3000);
  });

  return zocker(productZod)
    .generateMany(100)
    .map<ProductEntity>((p) => ({ id: Math.abs(p.id), name: p.name }));
}

export async function getProductById(id: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      const mess = `a product by id:${id} fetched!!`;

      resolve(mess);
      console.log(mess);
    }, 3000);
  });

  const product = zocker(productZod).generate();

  product.id = Math.abs(id);

  return product;
}

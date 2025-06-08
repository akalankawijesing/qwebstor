import React from 'react';
import { Product } from '@/sanity.types';
import ProductItem from './ProductItem';

type ProductGridProps = {
    products: Product[];
}

const ProductGrid = ({products}:ProductGridProps) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
       {products.map((product) => (
           <ProductItem key={product._id} product={product} />
       ))}
    </div>
);

export default ProductGrid;
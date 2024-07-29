import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../actions/productActions';

const ProductList = ({ getProducts, product: { products, loading } }) => {
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = state => ({
  product: state.product
});

export default connect(mapStateToProps, { getProducts })(ProductList);

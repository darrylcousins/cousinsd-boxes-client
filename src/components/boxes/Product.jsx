import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useApolloClient } from '@apollo/client';
import { numberFormat, updateTotalPrice } from '../../lib';
import ProductWrapper from './ProductWrapper';
import { CurrentPropTypes } from '../../graphql/init';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

const Cancel = styled.span` 
  font-size: 1.5em;
  padding-left: 0.5em;
`;

export default function Product({ product, type, data }) {
  const price = product.quantity * product.shopify_price;
  const productprice = product.isAddOn ? numberFormat(parseInt(price, 10) * 0.01) : '';
  const quantity = product.quantity > 1 ? ` (${product.quantity}) ` : ' ';
  const removable = (product.isAddOn && type === 'including') || type === 'dislikes';
  const icon = removable ? <Cancel>&#215;</Cancel> : '';

  const client = useApolloClient();

  const handleRemoveProduct = () => {
    let to;
    let from;
    if (type === 'dislikes') {
      from = type;
      to = 'including';
    } else if (type === 'including') {
      to = 'exaddons';
      from = 'addons';
    }

    const current = { ...data.current };
    current[from] = current[from].filter((el) => el.id !== product.id);

    const temp = { ...product };
    temp.quantity = 1;
    current[to] = current[to].concat([temp]);

    client.writeQuery({
      query: GET_CURRENT_SELECTION,
      data: { current },
    });

    updateTotalPrice(client);
  };

  if (!removable) {
    return (
      <ProductWrapper
        isAddOn={product.isAddOn}
        removable={removable}
      >
        {product.title}
        {quantity}
        {productprice}
        {icon}
      </ProductWrapper>
    );
  }
  return (
    <div
      tabIndex={product.id}
      role="button"
      onKeyDown={handleRemoveProduct}
      onClick={handleRemoveProduct}
    >
      <ProductWrapper
        isAddOn={product.isAddOn}
        removable={removable}
      >
        {product.title}
        {quantity}
        {productprice}
        {icon}
      </ProductWrapper>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    isAddOn: PropTypes.bool.isRequired,
    quantity: PropTypes.number.isRequired,
    shopify_price: PropTypes.number.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    current: PropTypes.shape(CurrentPropTypes),
  }).isRequired,
  type: PropTypes.string.isRequired,
};

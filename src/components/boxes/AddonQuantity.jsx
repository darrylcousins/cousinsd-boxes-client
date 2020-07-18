import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
} from '@shopify/polaris';
import { useApolloClient } from '@apollo/client';
import { nameSort, updateTotalPrice } from '../../lib';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export default function AddonQuantity({ id, qty }) {
  const client = useApolloClient();

  const handleChange = (value) => {
    const { current } = client.readQuery({
      query: GET_CURRENT_SELECTION,
    });
    const temp = current.addons.filter((el) => el.id === id.toString())[0];

    const product = { ...temp };
    product.quantity = parseInt(value, 10);

    const input = { ...current };
    input.addons = current.addons.filter((el) => el.id !== product.id).concat([product]);
    input.addons.sort(nameSort);
    client.writeQuery({
      query: GET_CURRENT_SELECTION,
      data: { current: input },
    });
    updateTotalPrice(client);
  };

  return (
    <TextField
      value={qty.toString()}
      onChange={(value) => handleChange(value)}
      min={1}
      type="number"
    />
  );
}

AddonQuantity.propTypes = {
  id: PropTypes.number.isRequired,
  qty: PropTypes.number.isRequired,
};

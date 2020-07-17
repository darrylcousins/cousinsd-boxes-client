import React, { useCallback } from 'react';
import {
  TextField,
} from '@shopify/polaris';
import { useApolloClient } from '@apollo/client';
import { nameSort, updateTotalPrice } from '../../lib';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export const AddonQuantity = ({ id, qty, data }) => {
  const client = useApolloClient();

  const handleChange = useCallback(({ id, qty }) => {
    const data = client.readQuery({
      query: GET_CURRENT_SELECTION,
    });
    const temp = data.current.addons.filter((el) => el.id === id)[0];
    const product = { ...temp };
    const current = { ...data.current };
    product.quantity = parseInt(qty);
    current.addons = current.addons.filter((el) => el.id !== product.id).concat([product]);
    current.addons.sort(nameSort);
    client.writeQuery({
      query: GET_CURRENT_SELECTION,
      data: { current },
    });
    updateTotalPrice(client);
  }, []);

  return (
    <TextField
      value={qty}
      onChange={(qty) => handleChange({ id, qty })}
      min={1}
      type="number"
    />
  );
};

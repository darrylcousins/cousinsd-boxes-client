import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@shopify/polaris';
import { useApolloClient } from '@apollo/client';
import ProductList from './ProductList';
import SelectDislikes from './SelectDislikes';
import SelectAddons from './SelectAddons';
import AddonText from './AddonText';
import Spacer from '../common/Spacer';
import Loader from '../common/Loader';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export default function Box({ loaded }) {
  const client = useApolloClient();

  const { current } = client.readQuery({
    query: GET_CURRENT_SELECTION,
  });

  const [customise, setCustomise] = useState(false);
  const handleChange = useCallback((newChecked) => setCustomise(newChecked), []);

  if (!loaded) return <Loader lines={2} />;

  const AddOnMarkup = () => {
    if (current.exaddons.length > 0) return (
        <>
          <AddonText />
          <SelectAddons />
          <ProductList type="exaddons" />
        </>
      );
    return null;
  };

  const customiseMarkup = (
    <>
      <Spacer />
      <SelectDislikes />
      <ProductList type="dislikes" />
      <AddOnMarkup />
    </>
  );

  return (
    <>
      <ProductList type="including" />
      <div key="table" style={{ display: 'table' }}>
        <div key="table-row" style={{ display: 'table-row' }}>
          <div key="table-cell" style={{ display: 'table-cell' }}>
            <Checkbox
              checked={customise}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'table-cell' }}>
            <span>Customise your box</span>
          </div>
        </div>
      </div>
      {customise && customiseMarkup}
    </>
  );
}

Box.propTypes = {
  loaded: PropTypes.bool.isRequired,
};

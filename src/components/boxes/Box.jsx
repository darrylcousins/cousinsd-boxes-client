import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@shopify/polaris';
import ProductList from './ProductList';
import SelectDislikes from './SelectDislikes';
import SelectAddons from './SelectAddons';
import AddonText from './AddonText';
import Spacer from '../common/Spacer';
import Loader from '../common/Loader';

export default function Box({ loaded }) {
  const [customise, setCustomise] = useState(false);
  const handleChange = useCallback((newChecked) => setCustomise(newChecked), []);

  if (!loaded) return <Loader lines={2} />;

  const customiseMarkup = (
    <>
      <Spacer />
      <SelectDislikes />
      <ProductList type="dislikes" />
      <AddonText />
      <SelectAddons />
      <ProductList type="exaddons" />
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

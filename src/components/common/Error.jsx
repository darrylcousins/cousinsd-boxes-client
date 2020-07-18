import React from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
} from '@shopify/polaris';

export default function Error({ message }) {
  return (
    <Banner status="critical">{message}</Banner>
  );
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

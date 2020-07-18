import React from 'react';
import PropTypes from 'prop-types';
import LoadingTextMarkup from './LoadingTextMarkup';

export default function Loader({ lines }) {
  return (
    <div style={{
      margin: '1rem 0',
      width: '100%',
    }}
    >
      <LoadingTextMarkup lines={lines} />
    </div>
  );
}

Loader.propTypes = {
  lines: PropTypes.number.isRequired,
};

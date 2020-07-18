import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  TextContainer,
  SkeletonBodyText,
  Spinner,
} from '@shopify/polaris';

const spinnerStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

export default function LoadingTextMarkup({ lines }) {
  return (
    <div style={{ position: 'relative' }}>
      <Card sectioned>
        <TextContainer>
          <SkeletonBodyText lines={lines} />
        </TextContainer>
      </Card>
      <div style={spinnerStyle}>
        <Spinner />
      </div>
    </div>
  );
}

LoadingTextMarkup.propTypes = {
  lines: PropTypes.number.isRequired,
};

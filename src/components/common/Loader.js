import React from 'react';
import { LoadingTextMarkup } from './LoadingTextMarkup';

export const Loader = ({ lines }) => (
  <div style={{
    margin: '1rem 0',
    width: '100%',
  }}
  >
    <LoadingTextMarkup lines={lines} />
  </div>
);

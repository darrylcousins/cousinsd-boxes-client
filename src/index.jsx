import React from 'react';
import PropTypes from 'prop-types';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import Box from './components/boxes/Box';
import Subscription from './components/boxes/Subscription';
import Spacer from './components/common/Spacer';
import { GET_INITIAL, GET_CURRENT_SELECTION } from './graphql/local-queries';
import { initial, current } from './graphql/init';
import { makeCurrent, numberFormat } from './lib';

/* wierd, something changed that meant that I could no longer export and use
 * these components without wrapping them in their own AppProvider
*/
function WrappedBox({ loaded, state, handleChange }) {
  return (
    <AppProvider i18n={enTranslations}>
      <Box loaded={loaded} />
      <Spacer />
      <Subscription
        state={state}
        handleChange={handleChange}
      />
    </AppProvider>
  );
}

WrappedBox.propTypes = {
  loaded: PropTypes.bool.isRequired,
  state: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export {
  WrappedBox,
  GET_INITIAL,
  GET_CURRENT_SELECTION,
  initial,
  current,
  makeCurrent,
  numberFormat,
};

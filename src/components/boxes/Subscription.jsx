import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ActionList,
  Button,
  Popover,
} from '@shopify/polaris';

export default function Subscription({ state, handleChange }) {
  //TODO waiting for subscription package
  return null;

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive(() => !popoverActive),
    [popoverActive],
  );

  const [subscription, setSubscription] = useState(state);
  const onetime = 'One time purchase (default)';
  const options = SUBSCRIPTIONS;

  const setSubscriptionChange = (value) => {
    setSubscription(value);
    handleChange(value);
    togglePopoverActive();
  };

  return (
    <Popover
      fullWidth
      fluidContent
      active={popoverActive}
      onClose={togglePopoverActive}
      activator={(
        <Button
          fullWidth
          onClick={togglePopoverActive}
          disclosure={!popoverActive ? 'down' : 'up'}
        >
          { subscription || 'Subscription options'}
        </Button>
      )}
    >
      <ActionList
        items={[
          {
            content: onetime,
            onAction: () => setSubscriptionChange(onetime),
          },
        ]
          .concat(options.map((el) => ({
            content: el,
            onAction: () => setSubscriptionChange(el),
          })))}
      />
    </Popover>
  );
}

Subscription.propTypes = {
  state: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

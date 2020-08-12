import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  Popover,
  ActionList,
  TextStyle,
} from '@shopify/polaris';
import { InitialPropType, BoxPropType } from '../../graphql/init';

export default function DateSelect({ initialData, boxes, onSelect }) {
  /* delivery date stuff */
  const [deliveryDate, setDeliveryDate] = useState(initialData.delivered);
  /* end delivery date stuff */

  /* action select stuff */
  const [selectActive, setSelectActive] = useState(false);
  const toggleSelectActive = useCallback(
    () => setSelectActive(() => !selectActive),
    [selectActive],
  );

  const activator = (
    <Button
      onClick={toggleSelectActive}
      disclosure
      fullWidth
    >
      { deliveryDate || 'Choose delivery date' }
    </Button>
  );
  /* end action select stuff */

  const handleDateSelect = (data) => {
    setDeliveryDate(data.delivered);
    setSelectActive(false);
    onSelect(data);
  };

  useEffect(() => {
    
    if (initialData.delivered.length > 0) {
      console.log(initialData);
      handleDateSelect(initialData);
    } else if (boxes.length === 1) {
      const data = Object.assign(initialData, {
        delivered: new Date(boxes[0].delivered).toDateString(),
        shopify_id: boxes[0].shopifyBox.shopify_product_id,
        box_id: boxes[0].id,
        shopify_title: boxes[0].shopifyBox.shopify_title,
        /* reset because selected different box */
        including: [],
        dislikes: [],
        addons: [],
        quantities: [],
        subscription: '',
        prodData: {i: [], a: [], d: [] },
        is_loaded: false,
      });
      handleDateSelect(data);
    }
  }, []);

  const ShowBanner = () => {
    if (!deliveryDate && boxes.length > 0) {
      return (
        <div style={{ marginBottom: '1rem' }}>
          <Banner status="warning">Please choose a date for delivery</Banner>
        </div>
      );
    } else if (deliveryDate) {
      return (
        <div style={{ marginBottom: '1rem' }}>
          <TextStyle variation="subdued">Delivery Date:</TextStyle>
        </div>
      );
    };
    if (boxes.length === 0) {
      return (
        <div style={{ marginBottom: '1rem' }}>
          <Banner status="warning">No boxes are scheduled for delivery, please return again later.</Banner>
        </div>
      );
    };
    return null;
  };

  const ShowSelect = ({boxes}) => {
    if (boxes.length > 0) {
      return (
        <Popover
          fullWidth
          active={selectActive}
          activator={activator}
          onClose={toggleSelectActive}
        >
          <ActionList
            items={
              boxes.map((item) => (
                {
                  content: new Date(item.delivered).toDateString(),
                  onAction: () => handleDateSelect(Object.assign(initialData, {
                    shopify_title: item.shopifyBox.shopify_title,
                    //delivered: new Date(item.delivered).toDateString(),
                    delivered: new Date(item.delivered).toDateString(),
                    shopify_id: item.shopifyBox.shopify_product_id,
                    box_id: item.id,
                    /* reset because selected different box */
                    including: [],
                    dislikes: [],
                    addons: [],
                    quantities: [],
                    prodData: {i: [], a: [], d: [] },
                    subscription: '',
                    is_loaded: false,
                  })),
                }
              ))
            }
          />
        </Popover>
      );
    };
    return null;
  };

  return (
    <>
      <ShowBanner />
      <ShowSelect boxes={boxes} />
    </>
  );
}

DateSelect.propTypes = {
  initialData: PropTypes.shape(InitialPropType).isRequired,
  boxes: PropTypes.arrayOf(BoxPropType).isRequired,
  onSelect: PropTypes.func.isRequired,
};

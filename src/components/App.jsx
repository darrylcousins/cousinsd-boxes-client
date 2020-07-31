import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/react-components';
import { useApolloClient } from '@apollo/client';
import { Button } from '@shopify/polaris';
import Loader from './common/Loader';
import Error from './common/Error';
import DateSelect from './boxes/DateSelect';
import Subscription from './boxes/Subscription';
import Box from './boxes/Box';
import Spacer from './common/Spacer';
import { makeCurrent, numberFormat } from '../lib';
import {
  GET_BOXES,
} from '../graphql/queries';
import {
  GET_INITIAL,
  GET_CURRENT_SELECTION,
} from '../graphql/local-queries';

export default function App({ shopifyId }) {
  /* XXX my idea is that we can use the initial data not only for reloading a
   * cart item but also for subscriptions
   */
  const [loaded, setLoaded] = useState(false);
  const client = useApolloClient();

  /* subscription selector */
  const handleSubscriptionChange = (subscription) => {
    const { current } = client.readQuery({
      query: GET_CURRENT_SELECTION,
    });
    const update = { ...current };
    update.subscription = subscription;
    client.writeQuery({
      query: GET_CURRENT_SELECTION,
      data: { current: update },
    });
    /*
    console.log('reading selection from client', client.readQuery({
      query: GET_CURRENT_SELECTION,
    }));
    */
  };
  /* end subscription selector */

  return (
    <Query
      query={GET_INITIAL}
    >
      {({ loading: initLoading, error: initError, data: initData }) => {
        if (initLoading) return <Loader lines={4} />;
        if (initError) return <Error message={initError.message} />;

        const { initial } = initData;

        if (initial.total_price > 0) {
          const price = (numberFormat(parseInt(initial.total_price, 10) * 0.01));
          document.querySelector('span[data-regular-price]').innerHTML = price;
        }

        const input = {
          shopify_product_id: shopifyId,
          limit: 5,
          offset: 0,
        };

        return (
          <Query
            query={GET_BOXES}
            variables={{ input }}
            fetchPolicy="cache"
          >
            {({ loading, error, data }) => {
              if (loading) return <Loader lines={4} />;
              if (error) return <Error message={error.message} />;

              const boxes = data.getBoxesByShopifyBox.rows;
              const initialCopy = JSON.parse(JSON.stringify(initial));

              // we re running a stored box (cart or subscription)
              if (initialCopy.delivered.length > 0) {
                const box = boxes
                  .filter((el) => new Date(initialCopy.delivered)
                  .toDateString() === new Date(el.delivered).toDateString());
                if (box.length > 0) initialCopy.box_id = box[0].id;
              }

              const handleSelect = (initialData) => {

                client.writeQuery({
                  query: GET_INITIAL,
                  data: { initial: initialData },
                });
                const temp = boxes.filter((el) => el.id === initialData.box_id);
                if (temp.length > 0) {
                  const box = temp[0];
                  const start = {
                    box,
                    delivered: initialData.delivered,
                    including: [...initialData.including],
                    addons: [...initialData.addons],
                    exaddons: [],
                    dislikes: [...initialData.dislikes],
                    quantities: [...initialData.quantities],
                    subscription: initialData.subscription,
                  };
                  const { current } = makeCurrent({ current: start, client });
                  client.writeQuery({
                    query: GET_CURRENT_SELECTION,
                    data: { current },
                  });
                  console.log('third read initial from client', client.readQuery({
                    query: GET_INITIAL,
                  }));
                }
                setLoaded(true);

                /*
                console.log(client.cache.data.data);
                console.log('reading initial from client', client.readQuery({
                  query: GET_INITIAL,
                }));
                console.log('reading current from client', client.readQuery({
                  query: GET_CURRENT_SELECTION,
                }));
                */

                /* get some existing form elements */
                const button = document.querySelector('button[name="add"]');
                button.removeAttribute('disabled');
                // loaded existing cart or subscription values
                if (initial.is_loaded) {
                  button.querySelector('[data-add-to-cart-text]').innerHTML = 'Update selection';
                }
              };
              /*
              */

              return (
                <div style={{
                  paddingBottom: '1rem',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
                >
                  <Spacer />
                  <Button fullWidth onClick={ () => console.log(JSON.stringify(client.cache.data.data.ROOT_QUERY.current, null, 2)) }>
                    show current</Button>
                  <Spacer />
                  <Button fullWidth onClick={ () => console.log(JSON.stringify(client.cache.data.data.ROOT_QUERY.initial, null, 2)) }>
                    show initial</Button>
                  <Spacer />
                  <DateSelect
                    boxes={boxes}
                    initialData={initialCopy}
                    onSelect={handleSelect}
                  />
                  { loaded && 
                    <Box
                      loaded={loaded}
                    />
                  }
                  <Spacer />
                  <Subscription
                    state={initial.subscription}
                    handleChange={handleSubscriptionChange}
                  />
                </div>
              );
            }}
          </Query>
        );
      }}
    </Query>
  );
}

App.propTypes = {
  shopifyId: PropTypes.number.isRequired,
};

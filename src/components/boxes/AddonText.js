import React from 'react';
import {
  TextField,
  Subheading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { useApolloClient } from '@apollo/client';
import styled from 'styled-components';
import { AddonQuantity } from './AddonQuantity';
import { Spacer } from '../common/Spacer';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { nameSort, updateTotalPrice } from '../../lib';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export const AddonText = () => {
  const ThirdWidth = styled.div`
    width: 30%;
  `;

  const TwoThirdWidth = styled.div`
    width: 100%;
  `;

  const client = useApolloClient();

  const handleClearButton = ({ product }) => {
    const data = client.readQuery({
      query: GET_CURRENT_SELECTION,
    });
    const current = { ...data.current };
    current.addons = current.addons.filter((el) => el.id !== product.id);
    current.addons.sort(nameSort);
    current.exaddons = current.exaddons.concat([product]);
    client.writeQuery({
      query: GET_CURRENT_SELECTION,
      data: { current },
    });
    updateTotalPrice(client);
  };

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;
        const { addons } = data.current;
        if (addons.length > 0) {
          return (
            <>
              <Subheading>Add on products</Subheading>
              { addons.map((el) => (
                <React.Fragment key={el.id}>
                  <Spacer />
                  <TwoThirdWidth>
                    <TextField
                      value={el.title}
                      readOnly
                      clearButton
                      onClearButtonClick={() => handleClearButton({ product: el })}
                      connectedRight={(
                        <ThirdWidth>
                          <AddonQuantity
                            qty={el.quantity.toString()}
                            id={el.id}
                            data={data}
                          />
                        </ThirdWidth>
                    )}
                    />
                  </TwoThirdWidth>
                  <Spacer />
                </React.Fragment>
              )) }
            </>
          );
        }
        return null;
      }}
    </Query>
  );
};

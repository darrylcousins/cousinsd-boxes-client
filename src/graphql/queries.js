import { gql } from '@apollo/client';

export const FRAGMENT_PRODUCT_ARRAY = gql`
  fragment productArray on Box {
    products {
      id
      shopify_title
      available
      shopify_gid
      shopify_id
      shopify_handle
      shopify_variant_id
      shopify_price
      __typename
    }
}`;

export const FRAGMENT_ADDONS_ARRAY = gql`
  fragment addOnProductArray on Box {
    addOnProducts {
      id
      shopify_title
      available
      shopify_gid
      shopify_id
      shopify_handle
      shopify_variant_id
      shopify_price
      __typename
    }
}`;

export const GET_BOXES = gql`
  query getBoxesByShopifyBox($input: BoxShopifyBoxSearchInput!) {
    getBoxesByShopifyBox(input: $input) {
      count
      rows {
        __typename
        id
        delivered
        shopifyBox {
          shopify_product_gid
          shopify_product_id
          shopify_variant_id
          shopify_handle
          shopify_title
          shopify_price
        }
        ...productArray
        ...addOnProductArray
      }
    }
  }
  ${FRAGMENT_PRODUCT_ARRAY}
  ${FRAGMENT_ADDONS_ARRAY}
`;

import PropTypes from 'prop-types';

export const initial = {
  box_id: '',
  delivered: '',
  including: [],
  addons: [],
  dislikes: [],
  shopify_title: '',
  shopify_id: 0,
  subscription: '',
  total_price: 0,
  quantities: [],
  prodData: {i:[],a:[],d:[]},
  is_loaded: false, // flag if loaded from cart or subscription
};

export const current = {
  box: {},
  delivered: '',
  including: [],
  addons: [],
  exaddons: [],
  dislikes: [],
  subscription: '',
};

export const ProductPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  shopify_title: PropTypes.string.isRequired,
  available: PropTypes.bool.isRequired,
  shopify_gid: PropTypes.string.isRequired,
  shopify_id: PropTypes.number.isRequired,
  shopify_handle: PropTypes.string.isRequired,
  shopify_variant_id: PropTypes.number.isRequired,
  shopify_price: PropTypes.number.isRequired,
});

export const ShopifyBoxPropType = PropTypes.shape({
  shopify_product_gid: PropTypes.string.isRequired,
  shopify_product_id: PropTypes.number.isRequired,
  shopify_handle: PropTypes.string.isRequired,
  shopify_title: PropTypes.string.isRequired,
  shopify_price: PropTypes.number.isRequired,
});

export const BoxPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  delivered: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(ProductPropType).isRequired,
  addOnProducts: PropTypes.arrayOf(ProductPropType).isRequired,
  shopifyBox: ShopifyBoxPropType,
});

export const InitialPropType = {
  box_id: PropTypes.string.isRequired,
  delivered: PropTypes.string.isRequired,
  including: PropTypes.arrayOf(PropTypes.string).isRequired,
  addons: PropTypes.arrayOf(PropTypes.string).isRequired,
  dislikes: PropTypes.arrayOf(PropTypes.string).isRequired,
  /*
  including: PropTypes.arrayOf(ProductPropType).isRequired,
  addons: PropTypes.arrayOf(ProductPropType).isRequired,
  dislikes: PropTypes.arrayOf(ProductPropType).isRequired,
  */
  shopify_title: PropTypes.string.isRequired,
  shopify_id: PropTypes.number.isRequired,
  subscription: PropTypes.string.isRequired,
  total_price: PropTypes.number.isRequired,
  quantities: PropTypes.array.isRequired,
  is_loaded: PropTypes.bool.isRequired,
};

export const CurrentPropType = {
  box: PropTypes.shape(BoxPropType).isRequired,
  delivered: PropTypes.string.isRequired,
  including: PropTypes.arrayOf(ProductPropType).isRequired,
  addons: PropTypes.arrayOf(ProductPropType).isRequired,
  dislikes: PropTypes.arrayOf(ProductPropType).isRequired,
  subscription: PropTypes.string.isRequired,
};

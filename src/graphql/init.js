import PropTypes from 'prop-types';

export const initial = {
  box_id: 0,
  delivered: '',
  including: [],
  addons: [],
  dislikes: [],
  shopify_title: '',
  shopify_id: 0,
  subscription: '',
  total_price: 0,
  quantities: [],
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

export const InitialPropTypes = {
  box_id: PropTypes.number.isRequired,
  delivered: PropTypes.string.isRequired,
  including: PropTypes.array.isRequired,
  addons: PropTypes.array.isRequired,
  dislikes: PropTypes.array.isRequired,
  shopify_title: PropTypes.string.isRequired,
  shopify_id: PropTypes.number.isRequired,
  subscription: PropTypes.string.isRequired,
  total_price: PropTypes.number.isRequired,
  quantities: PropTypes.array.isRequired,
  is_loaded: PropTypes.bool.isRequired,
};

export const CurrentPropTypes = {
  box: PropTypes.object.isRequired,
  delivered: PropTypes.string.isRequired,
  including: PropTypes.array.isRequired,
  addons: PropTypes.array.isRequired,
  dislikes: PropTypes.array.isRequired,
  subscription: PropTypes.string.isRequired,
};

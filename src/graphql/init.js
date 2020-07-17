export const initial = {
  box_id: 0,
  delivered: '',
  including: [],
  addons: [],
  dislikes: [],
  shopify_title: '',
  shopify_id: 0,
  subscription: false,
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
  subscription: false,
};

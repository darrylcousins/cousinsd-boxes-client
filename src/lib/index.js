import { LABELKEYS } from '../config';
import {
  PRODUCT_FULL_FRAGMENT,
  PRODUCT_FRAGMENT,
  GET_CURRENT_SELECTION,
} from '../graphql/local-queries';

export function postFetch(url, data) {
  // console.log('sending to ', url, data);
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export const nameSort = (a, b) => {
  const prodA = a.shopify_title.toUpperCase();
  const prodB = b.shopify_title.toUpperCase();
  if (prodA > prodB) return 1;
  if (prodA < prodB) return -1;
  return 0;
};

export const numberFormat = (amount, currencyCode = 'NZD') => {
  const amt = parseFloat(amount);
  let locale = 'en-NZ';
  if (currencyCode === 'NZD') locale = 'en-NZ';
  return (
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amt)
  );
};

export const updateTotalPrice = (client) => {
  const { current } = client.readQuery({
    query: GET_CURRENT_SELECTION,
  });

  if (!current.box.shopifyBox) {
    console.log('hopoing this is the spot', JSON.stringify(current, null, 2));
    return null;
  }
  let price = current.box.shopifyBox.shopify_price;
  current.addons.forEach((el) => {
    price += el.quantity * el.shopify_price;
  });
  price = numberFormat(price * 0.01);

  console.log('updating price', price);
  const priceEl = document.querySelector('span[data-regular-price]');
  if (priceEl) priceEl.innerHTML = price;
};

export const dateToISOString = (date) => {
  date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10); // try this out later
};

export const makeCurrent = ({ current, client }) => {
  /* the objects in the arrays are immutable so cannot add attribute
   * hence doing the json thing to denature the objects
   */
  const { box } = current;
  const qtys = current.quantities.reduce(
    (acc, curr) => Object.assign(acc, { [`${curr.handle}`]: curr.quantity }),
    {},
  );
  const includeIds = [];
  const boxProducts = JSON.parse(JSON.stringify(box.products))
    .filter((item) => item.available)
    .map((item) => {
      const quantity = item.shopify_handle in qtys ? qtys[item.shopify_handle] : 1;
      if (current.including.indexOf(item.shopify_handle) > -1) {
        includeIds.push(item.id);
      }
      const objectId = `Product:${item.id}`
      client.writeFragment({
        id: objectId,
        fragment: PRODUCT_FRAGMENT,
        data: {
          quantity,
          isAddOn: false,
        },
      });
      // return box.products.filter(el => el.id === item.id)[0];
      return client.readFragment({
        id: objectId,
        fragment: PRODUCT_FULL_FRAGMENT,
      });
    });
  const availAddOns = JSON.parse(JSON.stringify(box.addOnProducts))
    .filter((item) => item.available)
    .map((item) => {
      const quantity = item.shopify_handle in qtys ? qtys[item.shopify_handle] : 1;
      if (current.including.indexOf(item.shopify_handle) > -1) {
        includeIds.push(item.id);
      }
      const objectId = `Product:${item.id}`
      client.writeFragment({
        id: objectId,
        fragment: PRODUCT_FRAGMENT,
        data: {
          quantity,
          isAddOn: true,
        },
      });
      // return box.addOnProducts.filter(el => el.id === item.id)[0];
      return client.readFragment({
        id: objectId,
        fragment: PRODUCT_FULL_FRAGMENT,
      });
    });

  const including = (current.including.length)
    ? boxProducts.filter((el) => current.including.indexOf(el.shopify_handle) > -1)
    : boxProducts;
  // XXX adjust for (qty)
  const tempAddOns = current.addons.map((el) => {
    const idx = el.indexOf(' ');
    if (idx > -1) return el.slice(0, idx);
    return el;
  });
  const addons = availAddOns.filter((el) => tempAddOns.indexOf(el.shopify_handle) > -1);
  const exaddons = availAddOns.filter((el) => tempAddOns.indexOf(el.shopify_handle) === -1);
  const dislikes = boxProducts.filter((el) => current.dislikes.indexOf(el.shopify_handle) > -1);

  // console.log('box current', JSON.stringify(current, null, 1));

  // reduce to remove product arrays from box
  const update = {
    box,
    delivered: current.delivered,
    including,
    addons,
    exaddons,
    dislikes,
    subscription: current.subscription,
  };
  return { current: update };
};

export const toHandle = (title) => title.replace(/ /g, '-').toLowerCase();

export const stringToArray = (arr) => {
  const result = arr.split(',')
    .map((el) => {
      const str = el.trim();
      const match = str.match(/\(\d+\)$/);
      if (match) {
        return str.slice(0, match.index).trim();
      }
      return el.trim();
    })
    .filter((el) => el !== '')
    .map((el) => toHandle(el));
  return result;
}

export const makeInitialState = ({ response, path }) => {
  const [deliveryDate, productsIn, productsAdd, productsDislike, subscribed, exAddOns] = LABELKEYS;

  const priceEl = document.querySelector('span[data-regular-price]');
  const price = parseFloat(priceEl.innerHTML.trim().slice(1)) * 100;

  let cart = {
    box_id: '',
    delivered: '',
    including: [],
    addons: [],
    dislikes: [],
    shopify_title: '',
    shopify_id: 0,
    subscription: '',
    total_price: price,
    quantities: [],
    is_loaded: false,
  };

  //console.log(response);

  if (response.items) {
    response.items.forEach((el) => {
      if (el.product_type === 'Container Box' && path.indexOf(el.handle) > -1) {
        const totalPrice = response.total_price; // true total including addons
        const shopifyTitle = el.title;
        const shopifyId = el.product_id;
        const delivered = el.properties[deliveryDate];
        const subscription = subscribed in el.properties ? el.properties[subscribed] : '';
        const including = stringToArray(el.properties[productsIn]);
        const addons = stringToArray(el.properties[productsAdd]);
        const dislikes = stringToArray(el.properties[productsDislike]);
        cart = Object.assign(cart, {
          total_price: totalPrice,
          delivered,
          shopify_id: shopifyId,
          shopify_title: shopifyTitle,
          including,
          addons,
          dislikes,
          subscription,
          is_loaded: true,
        });
      }
    });

    if (cart.is_loaded) {
      response.items.forEach((el) => {
        if (el.product_type === 'Box Produce') {
          // Delivery Date: Wed Jul 22 2020
          // Add on product to: Box title
          if (cart.addons.indexOf(el.handle) > -1) {
            const props = el.properties;
            if (exAddOns in props && deliveryDate in props) {
              if (props[deliveryDate] === cart.delivered && props[exAddOns] === cart.shopify_title) {
                cart.quantities.push({
                  handle: el.handle,
                  quantity: el.quantity,
                  variant_id: el.variant_id,
                });
              }
            }
          }
        }
      });
    };
  }
  return cart;
};

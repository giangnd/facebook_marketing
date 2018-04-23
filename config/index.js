const env = process.env.NODE_ENV;
const production = require('./production');
const development = require('./development');

// You should put any global variables in here.
const config = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || '',
  SHOPIFY_SHARED_SECRET: process.env.SHOPIFY_SHARED_SECRET || '',
  APP_NAME: 'ReCart',
  APP_STORE_NAME: 'ReCart',
  APP_SCOPE: 'read_products,read_orders,write_orders,read_fulfillments,write_fulfillments,read_shipping,write_shipping,read_script_tags,write_script_tags,read_themes,write_themes,read_analytics',
};

if (env !== 'PRODUCTION') {
  module.exports = Object.assign({}, config, development);
} else {
  module.exports = Object.assign({}, config, production);
}

const query = `query @inContext(country: US) {
  products(first: 1) {
    nodes {
      handle
      availableForSale
      variants(first: 1) {
        nodes {
          availableForSale
          quantityAvailable
        }
      }
    }
  }
}`;

const res = await fetch('https://mumbai-baazar-store.myshopify.com/api/2024-10/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': 'ecd6dae011aac9106c8c42c5085d516e'
  },
  body: JSON.stringify({ query })
});

const data = await res.json();
console.log('US Country query result:', JSON.stringify(data, null, 2));

// lib/shopify.js

const domain = process.env.SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

async function shopifyFetch({ query, variables }) {
  try {
    const result = await fetch(
      `https://${domain}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 300 }, // 5 perc cache
      }
    );

    return await result.json();
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return { data: null };
  }
}

// Egy konkrét termék lekérése handle alapján
export async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        images(first: 5) {
          nodes { url }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle } });
  return response.data?.product;
}

// Ajánlott termékek (vagy kapcsolódó termékek) lekérése
export async function getRecommendedProducts(productId) {
  // Ebben a példában az első 4 terméket kérjük le "ajánlottként"
  const query = `
    query getRecommendations {
      products(first: 4) {
        nodes {
          id
          title
          handle
          images(first: 1) {
            nodes { url }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  return response.data?.products?.nodes || [];
}
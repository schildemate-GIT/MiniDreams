// app/api/search/route.js
import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = 'mateshoes.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '8bae15f33460e918e1b6924ad84a40ea'; 

export async function POST(request) {
  const { query } = await request.json();

  const storefrontQuery = `
    {
      products(first: 5, query: "title:${query}*") {
        nodes {
          id
          title
          handle
          images(first: 1) {
            nodes {
              url
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
      collections(first: 3, query: "title:${query}*") {
        nodes {
          title
          handle
        }
      }
    }
  `;

  try {
const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: storefrontQuery }),
    });

    const result = await response.json();
    return NextResponse.json({
      products: result.data.products.nodes,
      collections: result.data.collections.nodes
    });
  } catch (error) {
    return NextResponse.json({ error: 'Hiba a keresés során' }, { status: 500 });
  }
}
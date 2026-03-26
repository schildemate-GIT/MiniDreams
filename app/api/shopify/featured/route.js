// app/api/shopify/featured/route.js
// Ez váltja ki a shopify.php-t — tisztább, biztonságosabb, beépített cache

import { NextResponse } from 'next/server';

const SHOP = process.env.SHOPIFY_DOMAIN;       // pl. mateshoes.myshopify.com
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

// Next.js beépített ISR cache — pontosan mint a PHP file cache, de elegánsabb
export const revalidate = 300; // 5 perc

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(parseInt(searchParams.get('count') || '3'), 20); // max 20

  // Input validáció — mint a PHP-ban az action ellenőrzés
  if (!SHOP || !TOKEN) {
    return NextResponse.json(
      { error: 'Shopify konfiguráció hiányzik' },
      { status: 500 }
    );
  }

  const query = `{
    products(first: ${count}) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node { url }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price { amount }
                availableForSale
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch(
      `https://${SHOP}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': TOKEN,
        },
        body: JSON.stringify({ query }),
        // Next.js cache — 5 percig nem kérdezi újra a Shopify-t
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Shopify API hiba: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json(
      { error: 'Szerver hiba', message: err.message },
      { status: 500 }
    );
  }
}

import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  // ponytail: Shopify's default CSP is self + cdn.shopify.com only. This site
  // needs Google Fonts (style) and the Meta Pixel (script + connect), so both
  // are added explicitly. Removed hosts are ones we do not use: adding a broad
  // origin here is how an XSS hole becomes a data hole.
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    defaultSrc: ["'self'", 'https://cdn.shopify.com', 'https://shopify.com'],
    // Meta Pixel: connect.facebook.net serves fbevents.js, facebook.com/tr
    // sends the noscript beacon, and the API host receives the events.
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://connect.facebook.net',
      'https://www.facebook.com',
    ],
    // Google Fonts stylesheet; gstatic serves the font files.
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
    ],
    fontSrc: ["'self'", 'https://cdn.shopify.com', 'https://fonts.gstatic.com'],
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://www.facebook.com',
    ],
    connectSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://connect.facebook.net',
      'https://www.facebook.com',
      'https://graph.facebook.com',
      'https://*.facebook.com',
      'https://*.analytics.facebook.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

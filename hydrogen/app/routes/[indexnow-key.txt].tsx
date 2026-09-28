import type { Route } from './+types/[indexnow-key.txt]';
import { SITE } from '~/lib/seo';

export async function loader({}: Route.LoaderArgs) {
  return new Response(SITE.indexNowKey, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
}

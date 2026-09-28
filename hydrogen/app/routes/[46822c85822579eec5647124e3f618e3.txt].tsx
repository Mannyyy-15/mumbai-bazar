import type { Route } from './+types/[46822c85822579eec5647124e3f618e3.txt]';
import { SITE } from '~/lib/seo';

export async function loader({}: Route.LoaderArgs) {
  return new Response(SITE.indexNowKey, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
}

import type { Route } from './+types/[app-version.json]';

const VERSIONS = {
  android: {
    version: '1.0.0',
    minimum: '1.0.0',
    notes: '',
  },
  ios: {
    version: '1.0.0',
    minimum: '1.0.0',
    notes: '',
  },
} as const;

export async function loader({}: Route.LoaderArgs) {
  return new Response(JSON.stringify(VERSIONS, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

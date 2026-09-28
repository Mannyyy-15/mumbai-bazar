import {
  APPLE_TEAM_ID,
  IOS_BUNDLE_ID,
  DEEP_LINK_PATHS,
  appleLinksReady,
} from '~/lib/mobile-app';

function buildAasa(): string {
  const appId = `${APPLE_TEAM_ID}.${IOS_BUNDLE_ID}`;

  return JSON.stringify(
    {
      applinks: {
        details: [
          {
            appIDs: [appId],
            components: DEEP_LINK_PATHS.map((path) => ({
              '/': path,
              comment: `Open ${path} in the Mumbai Bazar app`,
            })),
          },
        ],
      },
      webcredentials: { apps: [appId] },
    },
    null,
    2,
  );
}

export async function loader() {
  if (!appleLinksReady()) {
    return new Response(null, {status: 404});
  }

  return new Response(buildAasa(), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}

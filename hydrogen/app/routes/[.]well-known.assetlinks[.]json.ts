import {
  ANDROID_APP_ID,
  ANDROID_CERT_FINGERPRINTS,
  androidLinksReady,
} from '~/lib/mobile-app';

function buildAssetLinks(): string {
  return JSON.stringify(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: ANDROID_APP_ID,
          sha256_cert_fingerprints: ANDROID_CERT_FINGERPRINTS,
        },
      },
    ],
    null,
    2,
  );
}

export async function loader() {
  if (!androidLinksReady()) {
    return new Response(null, {status: 404});
  }

  return new Response(buildAssetLinks(), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}

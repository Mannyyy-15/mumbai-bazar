import type {Route} from './+types/account_.login';

export async function loader({request, context}: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const acrValues = url.searchParams.get('acr_values') || undefined;
    const loginHint = url.searchParams.get('login_hint') || undefined;
    const loginHintMode = url.searchParams.get('login_hint_mode') || undefined;
    const locale = url.searchParams.get('locale') || undefined;

    return await context.customerAccount.login({
      countryCode: context.storefront.i18n.country,
      acrValues,
      loginHint,
      loginHintMode,
      locale,
    });
  } catch (error) {
    console.warn('Customer Account login redirected (credentials not yet linked in Shopify admin):', error);
    return new Response(null, {
      status: 302,
      headers: {Location: '/?info=customer_accounts_in_setup'},
    });
  }
}


import { Await } from 'react-router';
import { Suspense } from 'react';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { Aside } from '~/components/Aside';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { WhatsAppFab } from '~/components/WhatsAppFab';
import { CartMain } from '~/components/CartMain';
import { WishlistProvider } from '~/lib/wishlist-context';
import { WishlistDrawer } from '~/components/WishlistDrawer';
import { MobileBottomNav } from '~/components/MobileBottomNav';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
}

export function PageLayout({ cart, children = null }: PageLayoutProps) {
  return (
    <WishlistProvider>
      <Aside.Provider>
        <CartAside cart={cart} />
        <WishlistDrawer />
        <Suspense fallback={<Header />}>
          <Await resolve={cart}>
            {(resolvedCart) => <Header cart={resolvedCart} />}
          </Await>
        </Suspense>
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFab />
        <Suspense fallback={<MobileBottomNav cartCount={0} />}>
          <Await resolve={cart}>
            {(resolvedCart) => <MobileBottomNav cartCount={resolvedCart?.totalQuantity ?? 0} />}
          </Await>
        </Suspense>
      </Aside.Provider>
    </WishlistProvider>
  );
}

function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
  return (
    <Suspense
      fallback={
        <Aside type="cart" heading="Your Shopping Bag" count={0}>
          <div className="p-6 text-center text-taupe">Loading bag...</div>
        </Aside>
      }
    >
      <Await resolve={cart}>
        {(resolvedCart) => (
          <Aside
            type="cart"
            heading="Your Shopping Bag"
            count={resolvedCart?.totalQuantity ?? 0}
          >
            <CartMain cart={resolvedCart} layout="aside" />
          </Aside>
        )}
      </Await>
    </Suspense>
  );
}
